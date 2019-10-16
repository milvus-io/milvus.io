function fixHeaderLinks(language) {
  const headerLinks = document.querySelectorAll(".nav-site li > a");
  const linksToFix = [...headerLinks].filter(
    link => !link.href.includes(language) && !link.getAttribute("id")
  );
  linksToFix.forEach(l => {
    l.href = l.href.replace("/docs/", `/docs/${language}/`);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // add GDPR control
  var gtagId = "UA-142992812-1";
  // Allow tracking by default
  window["ga-disable-" + gtagId] = false;
  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());

  window.cookieconsent.initialise({
    onInitialise: function(status) {
      if (this.hasConsented("analytics")) {
        window["ga-disable-" + gtagId] = false;
        // Track this pageview
        gtag("config", gtagId);
      }
    },
    onAllow: function(category) {
      if (category === "analytics") {
        // Enable tracking
        window["ga-disable-" + gtagId] = false;
        // Track this pageview
        gtag("config", gtagId);
      }
    },
    onRevoke: function(category) {
      if (category === "analytics") {
        window["ga-disable-" + gtagId] = true;
      }
    }
  });

  // get lang
  const language = document.querySelector("html").getAttribute("lang");
  fixHeaderLinks(language);

  // index comparison table
  const trs = document.querySelectorAll("tr");
  [].forEach.call(trs, tr =>
    tr.addEventListener("click", () => {
      const content = tr.nextSibling;
      if (content.className)
        content.style.display =
          content.style.display == "none" ? "table-row" : "none";
    })
  );

  // decorate special link to button style
  const decorateLinkToButton = texts => {
    const ele_nav = document.querySelector(".nav-site");
    const group_link = ele_nav.getElementsByTagName("a");
    [].forEach.call(group_link, link => {
      if (link.innerText && texts.some(text => text === link.innerText)) {
        link.classList.add("top-button");
        link.href = "https://github.com/milvus-io/bootcamp";
      }
    });
  };
  decorateLinkToButton(["Try", "试用 Milvus"]);

  // multiple language
  const headerNavCon = document.querySelector(".nav-site");
  const languageMenu = document.querySelector(".nav-site>span");
  languageMenu.style.display = "none";
  const languageMap = {
    en: "En",
    "zh-CN": "中"
  };
  Object.keys(languageMap).forEach(l => {
    const li = document.createElement("li");
    let href = window.location.pathname.replace(/en|zh-CN/, l);
    if (href === "/") href += l;
    language === l
      ? li.classList.add("siteNavItemActive")
      : li.classList.remove("siteNavItemActive");
    li.innerHTML = `<a href="${href}" target="_self" data-v="${l}">${languageMap[l]}</a>`;
    headerNavCon.appendChild(li);
  });

  // transfer 'check_mark' and 'x' in tables to emoji
  // todo: there should be better translation method while packaging, not transfer it whilte domContentLoad.
  const td_eles = document.querySelectorAll("td");
  if (td_eles) {
    [].forEach.call(td_eles, td => {
      if (td.innerText === ":heavy_check_mark:") {
        td.innerHTML = `<g-emoji class="g-emoji" alias="heavy_check_mark" fallback-src="/images/heavy_check_mark.png">✔️</g-emoji>`;
        return false;
      }
      if (td.innerText === ":x:") {
        td.innerHTML = `<g-emoji class="g-emoji" alias="x" fallback-src="/images/x.png">❌</g-emoji>`;
        return false;
      }
      return false;
    });
  }

  // download pdf
  const nav = document.querySelector(".toc");
  if (!nav) return;

  // add Download PDF button
  const pdfMap = {
    vectordb: "vectordb",
    userguide: "userguide"
  };
  const createDownloadPdfElement = node => {
    const parent = node.parentNode;
    let targetName = "";
    let showpdf = Object.keys(pdfMap).some(n => {
      if (window.location.href.includes(n)) {
        targetName = n;
        return true;
      }
    });
    if (showpdf) {
      const targetLink = `${window.location.origin}/${pdfMap[targetName]}.all.${language}.pdf`;
      const downloadlink = document.createElement("div");
      downloadlink.innerHTML = `
                <a class="edit-page-link button" style="margin-left:10px !important;" target="_blank" href= ${targetLink} >
                <i class="fas fa-file-pdf"></i>
                    &nbsp; PDF 
                </a>`;
      parent.insertBefore(downloadlink, node);
    }
    return false;
  };
  // add Download PDF button && icon for Edit Button
  const editButtonEle = document.querySelector(".edit-page-link");
  if (editButtonEle) {
    createDownloadPdfElement(editButtonEle);
    editButtonEle.innerHTML = `<i class="far fa-edit"></i> &nbsp; ${
      language === "en" ? "Edit" : "编辑"
    }`;
  }

  // changeActive Navigation
  [].forEach.call(
    document.querySelector(".nav-site-internal").querySelectorAll("li"),
    (item, index) => {
      const isLanguageActive =
        item.classList.contains("siteNavItemActive") && index >= 7;

      const isItemActive =
        item.classList.contains("siteNavGroupActive") &&
        item.classList.contains("siteNavItemActive");
      isItemActive && item.classList.add("nav-item-active");
      isLanguageActive && item.classList.add("nav-language-active");
    }
  );
});
