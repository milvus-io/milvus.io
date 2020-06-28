import React, { useState, useEffect, useRef } from "react";
import Menu from "../menu";
import Header from "../header/header";
import Footer from "../footer/footer";
import "./index.scss";

export default (props) => {
  const {
    language,
    children,
    locale,
    menuList,
    id,
    versions,
    version,
    headings,
    wrapperClass = "doc-wrapper",
    isBenchMark = false,
  } = props;
  const formatHeadings =
    headings &&
    headings.reduce((pre, cur) => {
      const copyCur = JSON.parse(JSON.stringify(cur));
      const preHead = pre[pre.length - 1];
      if (preHead && preHead.depth < cur.depth) {
        pre[pre.length - 1].children.push(cur);
      } else {
        copyCur.children = [];
        pre = [...pre, copyCur];
      }
      return pre;
    }, []);
  const [hash, setHash] = useState(null);
  const docContainer = useRef(null);

  const effectVariable =
    typeof window !== "undefined" ? [window.location.hash] : [];
  useEffect(() => {
    if (window) {
      const hash = window.location.hash.slice(1);
      setHash(window.decodeURI(hash));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, effectVariable);

  // star reference
  const star = useRef(null);
  useEffect(() => {
    if (!window) {
      return;
    }
    if (!star.current) {
      return;
    }
    const repoUrl = `https://api.github.com/repos/milvus-io/milvus`;
    let latest = window.localStorage.getItem("milvus.io.stargazers");
    const latestFetchTime = window.localStorage.getItem(
      "milvus.io.stargazers_fetch_time"
    );

    if (!latestFetchTime || Date.now() - latestFetchTime > 60000 * 60) {
      // get
      fetch(repoUrl)
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            if (data.stargazers_count >= latest) {
              console.log(data.stargazers_count);
              window.localStorage.setItem(
                "milvus.io.stargazers",
                data.stargazers_count
              );
              window.localStorage.setItem(
                "milvus.io.stargazers_fetch_time",
                Date.now()
              );
              star.current.innerHTML = `<i class="fa fa-star" aria-hidden="true"></i>
                  ${data.stargazers_count}`;
            }
          }
        });
    } else {
      star.current.innerHTML = `<i class="fa fa-star" aria-hidden="true"></i>
                  ${latest}`;
    }
  }, []);

  const generateAnchorMenu = (headings, className) => {
    return headings.map((v) => {
      /* eslint-disable-next-line */
      const normalVal = v.value.replace(/[.｜,｜\/｜\'｜\?｜？｜、|，]/g, "");
      const anchor = normalVal.split(" ").join("-");
      let childDom = null;
      if (v.children && v.children.length) {
        childDom = generateAnchorMenu(v.children, "child-item");
      }
      return (
        <div className={`item ${className}`} key={v.value}>
          <a
            href={`#${anchor}`}
            title={v.value}
            className={anchor === hash ? "active" : ""}
          >
            {v.value}
          </a>
          {childDom}
        </div>
      );
    });
  };

  return (
    <div>
      <Header language={language} locale={locale} />
      <main className={wrapperClass}>
        <Menu
          menuList={menuList}
          versions={versions}
          activeDoc={id}
          version={version}
          locale={locale}
          isBenchMark={isBenchMark}
        ></Menu>
        <div
          className={`inner-container ${isBenchMark ? "fullwidth" : ""}`}
          ref={docContainer}
        >
          {children}
          {!isBenchMark && (
            <Footer locale={locale} style={{ background: "#fff" }}></Footer>
          )}
        </div>
        {formatHeadings && !isBenchMark && (
          <div className="anchor-wrapper">
            <section>
              {generateAnchorMenu(formatHeadings, "parent-item")}
              <div className="button-container">
                <a
                  ref={star}
                  className="btn"
                  href="http://github.com/milvus-io/milvus"
                >
                  <i className="fa fa-star" id="btn-star" aria-hidden="true"></i>
                  loading...
                </a>
                <a className="btn" id="btn-question" href={language.footer.questionBtn.link}>
                  <i className="fa fa-question" aria-hidden="true"></i>
                  {language.footer.questionBtn.label}
                </a>
                <a className="btn" id="btn-bug" href={language.footer.issueBtn.link}>
                  <i className="fa fa-bug" aria-hidden="true"></i>
                  {language.footer.issueBtn.label}
                </a>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};
