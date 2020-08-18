import React, { useState, useEffect, useRef } from "react";
import Menu from "../menu";
import Header from "../header/header";
import Footer from "../footer/footer";
import AskMilvus from "../../images/ask_milvus.png";
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
    current,
    wrapperClass = "doc-wrapper",
    isBenchMark = false,
    showDoc = true,
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
  const [showToTopButton, setShowToTopButton] = useState(false);

  // const effectVariable =
  //   typeof window !== 'undefined' ? [window.location.hash] : [];
  // useEffect(() => {
  //   if (window) {
  //     const hash = window.location.hash.slice(1);
  //     setHash(window.decodeURI(hash));
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, effectVariable);

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

    if (
      !latestFetchTime ||
      Date.now() - latestFetchTime > 60000 * 60 ||
      !latest
    ) {
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

  useEffect(() => {
    const cb = () => {
      const wrapper = document.querySelector("html");

      const showButton = wrapper.scrollTop !== 0;
      setShowToTopButton(showButton);
    };

    window.addEventListener("scroll", () => {
      cb();
    });

    return window.removeEventListener("scroll", () => {
      cb();
    });
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
            onClick={(e) => onAnchorClick(e, anchor)}
          >
            {v.value}
          </a>
          {childDom}
        </div>
      );
    });
  };

  const onAnchorClick = (event, anchor) => {
    event.stopPropagation();
    event.preventDefault();

    setHash(anchor);

    const element = document.querySelector(`#${anchor}`);
    const offset = 62;

    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = element.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
    });
  };

  const onToTopClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div>
      <Header
        language={language}
        current={current}
        locale={locale}
        showDoc={showDoc}
      />
      <main className={wrapperClass}>
        <Menu
          menuList={menuList}
          versions={versions}
          activeDoc={id.split("-")[0]}
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

              <a href="https://rpst.page.link/M7tB">
                <div><img width="180" src={AskMilvus} alt="Ask Milvus"></img></div>
                click <strong>here</strong> to register
              </a>

              <div className="button-container">
                <a
                  ref={star}
                  className="btn"
                  href="http://github.com/milvus-io/milvus"
                >
                  <i
                    className="fa fa-star"
                    id="btn-star"
                    aria-hidden="true"
                  ></i>
                  3628
                </a>
                <a
                  className="btn"
                  id="btn-question"
                  href={language.footer.questionBtn.link}
                >
                  <i className="fa fa-question" aria-hidden="true"></i>
                  {language.footer.questionBtn.label}
                </a>
                <a
                  className="btn"
                  id="btn-bug"
                  href={language.footer.issueBtn.link}
                >
                  <i className="fa fa-bug" aria-hidden="true"></i>
                  {language.footer.issueBtn.label}
                </a>
              </div>
            </section>
          </div>
        )}

        {showToTopButton && (
          <div className="button-to-top" onClick={onToTopClick}>
            <i className="fas fa-arrow-up"></i>
          </div>
        )}
      </main>
    </div>
  );
};
