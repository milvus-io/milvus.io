import React, { useState, useEffect, useRef } from "react"
import Menu from "../menu"
import Header from "../header/header"
import Footer from "../footer/footer"
import "./index.scss"

export default props => {
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
  } = props
  const formatHeadings =
    headings &&
    headings.reduce((pre, cur) => {
      const copyCur = JSON.parse(JSON.stringify(cur))
      const preHead = pre[pre.length - 1]
      if (preHead && preHead.depth < cur.depth) {
        pre[pre.length - 1].children.push(cur)
      } else {
        copyCur.children = []
        pre = [...pre, copyCur]
      }
      return pre
    }, [])
  const [hash, setHash] = useState(null)
  const docContainer = useRef(null)

  const effectVariable =
    typeof window !== "undefined" ? [window.location.hash] : []
  useEffect(() => {
    if (window) {
      const hash = window.location.hash.slice(1)
      const container = docContainer.current
      // fixed header will cover h1 header. fix by translate\
      container.style.transform = "translate3d(0, 60px, 0)"
      setHash(window.decodeURI(hash))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, effectVariable)

  const generateAnchorMenu = (headings, className) => {
    return headings.map(v => {
      /* eslint-disable-next-line */
      const normalVal = v.value.replace(/[\,\/\'\?\？]/g, "")
      const anchor = normalVal.split(" ").join("-")
      let childDom = null
      if (v.children && v.children.length) {
        childDom = generateAnchorMenu(v.children, "child-item")
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
      )
    })
  }

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
        ></Menu>
        <div className="inner-container" ref={docContainer}>
          {children}
          <Footer
            versions={versions}
            language={language}
            locale={locale}
          ></Footer>
        </div>
        {formatHeadings && (
          <div className="anchor-wrapper">
            {generateAnchorMenu(formatHeadings, "parent-item")}
          </div>
        )}
      </main>

      {/* <Contact data={data} locale={locale} /> */}
    </div>
  )
}
