import { Remarkable } from 'remarkable';
import hljs from 'highlight.js';

function addPrefixToHref(htmlString, prefix) {
  const hrefRegex = /href="([^"]*)"/g;
  const prefixedHtmlString = htmlString.replace(hrefRegex, (match, href) => {
    const newHref =
      href.charAt(0) === '#' || href.charAt(0) === '/' || href.includes('http')
        ? href
        : `${prefix}${href}`;
    return `href="${newHref}"`;
  });
  return prefixedHtmlString;
}

const convertImgSrc = (version, src) => {
  if (src.includes('http')) {
    return src;
  }

  const path = src
    .split('/')
    .filter(v => v !== '.' && v !== '..')
    .join('/');
  if (version === 'blog') {
    return `/blogs/${path}`;
  }

  return `/docs/${version}/${path}`;
};

const getHeadingIdFromToken = token => {
  // in order to ensure every heading href is unique even when content is same, we use heading content + lines as id
  const pattern =
    /[`~!@#_$%^&*()=|{}':;',\\\[\\\].<>/?~!@#￥……&*（）——|{}【】‘；：”“""'。，、？]/g;
  const content = token.content;
  const formatText = `${content}`.replaceAll(pattern, '');
  return formatText.replaceAll(/\s/g, '-');
};

export async function markdownToHtml(markdown, options = {}) {
  const {
    showAnchor = false,
    version = 'v2.1.x',
    needCaption = false,
    path = '',
  } = options;

  const md = new Remarkable({
    html: true,
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return (
            hljs.highlight(lang, str).value +
            `<button class="copy-code-btn"></button>`
          );
        } catch (err) {
          console.log('error', err);
        }
      } else {
        // no language named curl
        try {
          return (
            hljs.highlight('shell', str).value +
            `<button class="copy-code-btn"></button>`
          );
        } catch (err) {
          console.log('error', err);
        }
      }

      try {
        return hljs.highlightAuto(str).value;
      } catch (err) {
        console.log('error', err);
      }

      return ''; // use external default escaping
    },
  });

  const codeList = [];
  let titleContent = '';
  const headingAnchorList = [];

  // get code content of code block, used for code copy button
  const getCodesPlugin = md => {
    const rule = md.renderer.rules.fence;
    md.renderer.rules.fence = function (tokens, idx, options, env, instance) {
      codeList.push(tokens[idx].content);
      return rule(tokens, idx, options, env, instance);
    };
  };

  // add copy link icon after headings
  const getAnchorsPlugin = md => {
    md.renderer.rules.heading_open = function (tokens, idx) {
      const id = getHeadingIdFromToken(tokens[idx + 1]);

      return `<h${tokens[idx].hLevel} id=${id} class="common-anchor-header">`;
    };

    md.renderer.rules.heading_close = function (tokens, idx) {
      const headingLevel = tokens[idx].hLevel;
      const href = getHeadingIdFromToken(tokens[idx - 1]);

      if (headingLevel > 2) {
        return `</h${headingLevel}>`;
      }
      headingAnchorList.push({
        label: tokens[idx - 1].content,
        href,
        type: headingLevel,
        isActive: false,
      });

      return `<a data-href="#${href}" class="anchor-icon">
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
        </svg></a></h${headingLevel}>`;
    };
  };

  // generate a caption at bottom of image, use alt props as content
  const generateImgCaptionPlugin = md => {
    md.renderer.rules.image = function (tokens, idx) {
      const src = tokens[idx].src;
      const alt = tokens[idx].alt;
      const id = alt.toLocaleLowerCase().replaceAll(/\s/g, '-');

      const url = convertImgSrc(version, src);

      return `
      <span class="img-wrapper">
        <img src="${url}" alt="${alt}" class="doc-image" id="${id}" />
        <span>${alt}</span>
      </span>
    `;
    };
  };

  // replace img src in html block like <div><img src='xxx' /><div>
  const formatHtmlBlockImgPlugin = md => {
    const rule = md.renderer.rules.htmlblock;
    md.renderer.rules.htmlblock = function (
      tokens,
      idx,
      options,
      env,
      instance
    ) {
      const content = tokens[idx].content;

      if (content.includes('src=')) {
        const tpl = content.replaceAll(
          /\.\.(\S*)\.[svg|jpg|jpeg|png]/g,
          string => {
            const url = convertImgSrc(version, string);
            return url;
          }
        );
        tokens[idx].content = tpl;
      }

      return rule(tokens, idx, options, env, instance);
    };
  };

  // replace img src in html block like <img src='xxx' />
  const formatHtmlInlineImgPlugin = md => {
    const rule = md.renderer.rules.htmltag;
    md.renderer.rules.htmltag = function (tokens, idx, options, env, instance) {
      const content = tokens[idx].content;

      if (content.includes('src=')) {
        const tpl = content.replace(/\.\.(\S*)\.[svg|jpg|jpeg|png]/, string => {
          const url = convertImgSrc(version, string);
          return url;
        });
        tokens[idx].content = tpl;
      }

      return rule(tokens, idx, options, env, instance);
    };
  };

  const getPageTitlePlugin = md => {
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
  showAnchor && md.use(getAnchorsPlugin);
  md.use(generateImgCaptionPlugin);
  md.use(getPageTitlePlugin);
  md.use(formatHtmlBlockImgPlugin);
  md.use(formatHtmlInlineImgPlugin);

  const tree = addPrefixToHref(md.render(markdown), path);
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
