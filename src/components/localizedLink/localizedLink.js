import React from "react";
import { Link } from "gatsby";
import locales from "../../consts/locales.js";
import "./localizedLink.scss";

export default ({ locale, to, children, className = "link" }) => {
  const language = locales[locale];
  const toMedium = locale === "en" && to.includes("blog");
  if (toMedium) {
    return (
      <a
        href="https://medium.com/tag/milvus-project/latest"
        target="_blank"
        rel="noopener noreferrer"
        children={children}
        aria-label="Milvus Blog"
        className={className}
      ></a>
    );
  }

  let path;

  language && !language.default ? (path = `/${locale}${to}`) : (path = to);
  return <Link className={className} children={children} to={path} />;
};
