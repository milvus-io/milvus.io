import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Layout from "../components/docLayout";
import SEO from "../components/seo";
import { graphql } from "gatsby";
import hljs from "highlight.js";
import ReactTooltip from "react-tooltip";
import "highlight.js/styles/atom-one-dark.css";
import "./docTemplate.scss";
import { useMobileScreen } from "../hooks";
import Code from "../components/code/code";
import QueryModal from "../components/query-modal/query-modal";
// hljs.registerLanguage("sql", sql)
// hljs.registerLanguage("bash", bash)

function sortVersions(a, b) {
  const [v1, s1, m1] = a.split(".");
  const [v2, s2, m2] = b.split(".");
  const aValue = v1.split("")[1] * 100 + s1 * 10 + m1 * 1;
  const bValue = v2.split("")[1] * 100 + s2 * 10 + m2 * 1;

  if (aValue > bValue) {
    return -1;
  }
  if (aValue === bValue) {
    return 0;
  }
  if (aValue < bValue) {
    return 1;
  }
}

export default function Template({
  data,
  pageContext, // this prop will be injected by the GraphQL query below.
}) {
  let {
    locale,
    version,
    versions,
    headings = [],
    allMenus,
    isBlog,
    isBenchmark = false,
    editPath,
    newHtml,
  } = pageContext;
  versions = versions.sort(sortVersions);
  const screenWidth = useMobileScreen();

  const [showBack, setShowBack] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    document.querySelectorAll(".query-button-panel").forEach((panel) => {
      const codeWrapper = panel.previousElementSibling;
      codeWrapper.classList.add("query-button-code");

      const querySnippet = codeWrapper.querySelector("code").textContent;
      const formatCode = getRequestAsCURL(querySnippet);

      panel.addEventListener("click", (e) => {
        const funcMap = {
          copy: handleCopy,
          console: handleOpenConsole,
          // setting wrapper
          setting: handleSetting,
          // setting icon
          "fa-cog": handleSetting,
        };

        const classList = e.target.classList;

        Object.keys(funcMap).forEach((key) => {
          if (classList.contains(key)) {
            funcMap[key](formatCode);
          }
        });
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopy = (code) => {
    copyToClipboard(code);
  };
  const handleOpenConsole = () => {
    console.log("open console");
  };
  const handleSetting = () => setShowModal(true);

  useEffect(() => {
    const filterWrappers = document.querySelectorAll(".filter");
    const allFilters = [];
    filterWrappers.forEach((fw) => {
      const fs = fw.querySelectorAll("a");
      fs.forEach((f) => {
        allFilters.push(f);
      });
    });
    const allContents = document.querySelectorAll(`[class^="filter-"]`);

    const clickEventHandler = (targetHash) => {
      const hash = targetHash;
      const currentFilters = allFilters.filter((f) => f.hash === hash);
      allFilters.forEach((f) => f.classList.toggle("active", false));
      currentFilters.forEach((cf) => cf.classList.toggle("active", true));
      allContents.forEach((c) => c.classList.toggle("active", false));
      const contents = document.querySelectorAll(
        `.filter-${hash.replace("#", "")}`
      );
      contents.forEach((c) => c.classList.toggle("active", true));
    };
    filterWrappers.forEach((w) => {
      w.addEventListener("click", (e) => {
        if (e.target.tagName === "A") {
          clickEventHandler(e.target.hash);
        }
      });
    });

    if (window) {
      const windowHash = window.location.hash;
      clickEventHandler(windowHash);
    }
  }, []);

  useEffect(() => {
    document.querySelectorAll("pre code").forEach((block) => {
      hljs.highlightBlock(block);

      const html = block.innerHTML;
      const content = block.textContent;
      const code = <Code html={html} content={content} locale={locale} />;
      ReactDOM.render(code, block);
    });

    return () => {
      document.querySelectorAll("pre code").forEach((block) => {
        ReactDOM.unmountComponentAtNode(block);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (screenWidth > 1000) return;
    const cb = (e) => {
      if (e.target.dataset.tip) {
        ReactTooltip.show(e.target);
      }
    };
    window.addEventListener("click", cb);
    return () => {
      window.removeEventListener("click", cb);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!data.allFile.edges[0]) {
    return null;
  }

  const layout = data.allFile.edges[0]
    ? data.allFile.edges[0].node.childLayoutJson.layout
    : {};
  const menuList = allMenus.find(
    (v) =>
      v.absolutePath.includes(version) &&
      isBlog === v.isBlog &&
      locale === v.lang
  );
  const { markdownRemark } = data; // data.markdownRemark holds our post data
  let { frontmatter } = markdownRemark;
  const nav = {
    current: "doc",
  };
  const iframeUrl = isBenchmark
    ? `/benchmarks/${frontmatter.id.split("_")[1]}/index.html`
    : "";
  const idRegex = /id=".*?"/g;
  if (locale === "cn") {
    newHtml = newHtml.replace(idRegex, (match) =>
      // eslint-disable-next-line
      match.replace(/[？|、|，]/g, "")
    );
  }

  const ifrmLoad = () => {
    const ifrmContainer = document.querySelector(".iframe-container");
    const ifrm = document.querySelector("#benchmarkIframe");
    // const size = ifrm.contentWindow.document.body.getBoundingClientRect();
    ifrm.style.height = "100%";
    ifrmContainer.style.height = "100%";
    setShowBack(!/index\.html/.test(ifrm.contentWindow.location.href));
  };
  const handleRefresh = () => {
    const ifrm = document.querySelector("#benchmarkIframe");
    if (ifrm) {
      ifrm.contentWindow.location.href = ifrm.src;
    }
  };

  const getRequestAsCURL = (code) => {
    const [header, ...data] = code.split("\n");
    const [method, url] = header.split(" ");
    const queryBody = data.join("\n");

    return `curl -X ${method} "http://localhost:8000${url}" -H 'Content-Type: application/json' -d'\n${queryBody}'`;
  };

  const copyToClipboard = (content) => {
    const el = document.createElement(`textarea`);
    el.value = content;
    el.setAttribute(`readonly`, ``);
    el.style.position = `absolute`;
    el.style.left = `-9999px`;
    document.body.appendChild(el);
    el.select();
    document.execCommand(`copy`);
    document.body.removeChild(el);
  };

  const title = isBenchmark
    ? `Milvus benchmark`
    : `${headings[0] && headings[0].value}`;

  const onOverlayClick = () => setShowModal(false);

  return (
    <Layout
      language={layout}
      locale={locale}
      nav={nav}
      current="doc"
      pageContext={pageContext}
      menuList={menuList}
      version={version}
      headings={headings.filter((h, i) => i > 0)}
      versions={versions}
      id={frontmatter.id}
      isBenchMark={isBenchmark}
      showDoc={false}
    >
      <SEO title={title} lang={locale} />
      {isBenchmark ? (
        <div className="iframe-container">
          {showBack && (
            <i
              tabIndex={0}
              onKeyDown={handleRefresh}
              role="button"
              aria-label="Back"
              className="fas iframe-icon fa-arrow-left"
              onClick={handleRefresh}
            ></i>
          )}
          <iframe
            id="benchmarkIframe"
            title="test"
            width="100%"
            src={iframeUrl}
            onLoad={ifrmLoad}
          ></iframe>
        </div>
      ) : (
        <div className="doc-post-container">
          <div className="doc-post">
            <div
              className="doc-post-content"
              dangerouslySetInnerHTML={{ __html: newHtml }}
            />
            <ReactTooltip
              type="info"
              // place="right"
              globalEventOff="click"
              className="md-tooltip"
            />
            {isBlog || isBenchmark ? null : (
              <a
                className="edit-page-link btn"
                href={`https://github.com/milvus-io/docs/edit/master/${version}/site/${
                  locale === "en" ? "en" : "zh-CN"
                }/${editPath}`}
                target="_blank"
                rel="noreferrer noopener"
              >
                <i className="far fa-edit"></i>
                {layout.footer.editBtn.label}
              </a>
            )}
          </div>
        </div>
      )}

      {showModal ? (
        <div>
          <div
            className="overlay"
            tabIndex="0"
            role="button"
            aria-label="close dialog"
            onKeyDown={onOverlayClick}
            onClick={onOverlayClick}
          ></div>
          <QueryModal locale={locale} setShowModal={setShowModal} />
        </div>
      ) : null}
    </Layout>
  );
}

export const pageQuery = graphql`
  query($locale: String, $old: String, $fileAbsolutePath: String) {
    markdownRemark(
      fileAbsolutePath: { eq: $fileAbsolutePath }
      frontmatter: { id: { eq: $old } }
    ) {
      frontmatter {
        id
        title
      }
    }
    allFile(
      filter: {
        name: { eq: $locale }
        relativeDirectory: { regex: "/(?:layout)/" }
      }
    ) {
      edges {
        node {
          relativeDirectory

          childLayoutJson {
            layout {
              header {
                quick
                benchmarks
                why
                gui
                tutorials
                solution
                about
                doc
                blog
                try
                loading
                noresult
                tutorial
                search
                bootcamp
              }
              footer {
                editBtn {
                  label
                }
                questionBtn {
                  label
                  link
                }
                issueBtn {
                  label
                  link
                }
                product {
                  title
                  txt1
                  txt2
                }
                doc {
                  title
                  txt1
                  txt2
                  txt3
                }
                tool {
                  title
                  txt1
                }
                resource {
                  title
                  txt1
                  txt2
                  txt3
                  txt4
                }
                contact {
                  title
                  wechat
                }
              }
            }
          }
        }
      }
    }
  }
`;
