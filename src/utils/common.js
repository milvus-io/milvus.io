import { Remarkable } from 'remarkable';
import hljs from 'highlight.js';

const getHeadingIdFromToken = (token) => {
  // in order to ensure every heading href is unique even when content is same, we use heading content + lines as id
  const content = token.content;
  const linesTxt = token.lines.join('-');
  return `${content}-${linesTxt}`.replaceAll(/\s/g, '-');
};

export async function markdownToHtml(markdown) {
  const md = new Remarkable({
    html: true,
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return (
            hljs.highlight(lang, str).value +
            `<button class="copy-code-btn"></button>`
          );
        } catch (err) {}
      }

      try {
        return hljs.highlightAuto(str).value;
      } catch (err) {}

      return ''; // use external default escaping
    },
  });

  const codeList = [];
  let titleContent = '';
  const headingAnchorList = [];

  // get code content of code block, used for code copy button
  const getCodesPlugin = (md) => {
    const rule = md.renderer.rules.fence;
    md.renderer.rules.fence = function (
      tokens,
      idx,
      options,
      env,
      instance
    ) {
      codeList.push(tokens[idx].content);
      return rule(tokens, idx, options, env, instance);
    };
  };

  // add copy link icon after headings
  const getAnchorsPlugin = (md) => {
    md.renderer.rules.heading_open = function (tokens, idx) {
      const id = getHeadingIdFromToken(tokens[idx + 1]);

      return `<h${tokens[idx].hLevel} id=${id} class="common-anchor-header">`;
    };

    md.renderer.rules.heading_close = function (tokens, idx) {
      const headingLevel = tokens[idx].hLevel;
      const href = getHeadingIdFromToken(tokens[idx - 1]);

      headingAnchorList.push({
        label: tokens[idx - 1].content,
        href,
        type: headingLevel,
        isActive: false,
      });

      return `<button data-href="#${href}" class="anchor-icon">
        <svg
          aria-hidden="true"
          focusable="false"
          height="20"
          version="1.1"
          viewBox="0 0 16 16"
          width="16"
        >
          <path
            fill="#0092E4"
            fill-rule="evenodd"
            d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
          ></path>
        </svg></h${headingLevel}>`;
    };
  };

  // remove .md in inline markdown link: [some-link](https://)
  const formatInlineLinkPlugin = (md) => {
    const rule = md.renderer.rules.link_open;
    md.renderer.rules.link_open = function (
      tokens,
      idx,
      options,
      env,
      instance
    ) {
      const href = tokens[idx].href;

      const isExternalLink = href.includes('https');
      if (href && href.includes('.md') && !isExternalLink) {
        tokens[idx].href = href.replace(/\.md/, '');
      }
      return rule(tokens, idx, options, env, instance);
    };
  };

  // remove .md in <a> under a code block like: <div><a href></a></div>
  const formatHtmlBlockATagPlugin = (md) => {
    const rule = md.renderer.rules.htmlblock;
    md.renderer.rules.htmlblock = function (
      tokens,
      idx,
      options,
      env,
      instance
    ) {
      const content = tokens[idx].content;
      const isExternalLink = content.includes('https');

      if (content.includes('href=') && !isExternalLink) {
        const tpl = content.replaceAll(/\.md/g, '');
        tokens[idx].content = tpl;
      }

      return rule(tokens, idx, options, env, instance);
    };
  };

  // remove .md in inline html tag like: some content <a></a>
  const formatInlineATagPlugin = (md) => {
    const rule = md.renderer.rules.htmltag;
    md.renderer.rules.htmltag = function (
      tokens,
      idx,
      options,
      env,
      instance
    ) {
      const content = tokens[idx].content;
      const isExternalLink = content.includes('https');

      if (content.includes('href=') && !isExternalLink) {
        const tpl = tokens[idx].content.replace(/\.md/, '');
        tokens[idx].content = tpl;
      }

      return rule(tokens, idx, options, env, instance);
    };
  };

  // generate a caption at bottom of image, use alt props as content
  const generateImgCaptionPlugin = (md) => {
    md.renderer.rules.image = function (tokens, idx) {
      const src = tokens[idx].src;

      const alt = tokens[idx].alt;
      const id = alt.toLocaleLowerCase().replaceAll(/\s/g, '-');

      return `
      <span class="img-wrapper">
        <img src="${src}" alt="${alt}" class="doc-image" id="${id}" />
        <span>${alt}</span>
      </span>
    `;
    };
  };

  const getPageTitlePlugin = (md) => {
    const rule = md.renderer.rules.heading_open;

    md.renderer.rules.heading_open = function (
      tokens,
      idx,
      options,
      env,
      instance
    ) {
      if (tokens[idx].hLevel === 1) {
        titleContent = tokens[idx + 1].content;
      }
      return rule(tokens, idx, options, env, instance);
    };
  };

  md.use(getCodesPlugin);
  md.use(getAnchorsPlugin);
  md.use(formatInlineLinkPlugin);
  md.use(formatHtmlBlockATagPlugin);
  md.use(formatInlineATagPlugin);
  md.use(generateImgCaptionPlugin);
  md.use(getPageTitlePlugin);

  const tree = md.render(markdown);
  return {
    tree,
    codeList,
    headingContent: titleContent,
    anchorList: headingAnchorList,
  };
}

export const copyToCommand = (value, cb) => {
  const input = document.createElement('input');
  document.body.appendChild(input);
  input.setAttribute('value', value);
  input.select();
  if (document.execCommand('copy')) {
    document.execCommand('copy');
    cb && cb();
  }
  document.body.removeChild(input);
};

export const resetCookie = () => {
  let cookieKeys = document.cookie.match(/[^ =;]+(?=\=)/g); // fetch cookie
  let date = new Date();
  date.setTime(date.getTime() - 10000);
  if (cookieKeys) {
    // set cookie expire time
    for (var i = 0; i < cookieKeys.length; i++) {
      document.cookie =
        cookieKeys[i] + '=0; expires=' + date.toUTCString() + '; path=/';
    }
  }
};
