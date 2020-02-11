import React, { useState, useEffect } from "react";
import LocalizeLink from "../localizedLink/localizedLink";
import "./index.scss";
/* eslint-disable */
const Selector = props => {
  const { selected, options, locale, isVersion = false, setSelected = () => { } } = props;
  const [listStatus, setListStatus] = useState(false);
  const toggleList = e => {
    e.stopPropagation();
    setListStatus(!listStatus);
  };

  useEffect(() => {
    const cb = () => {
      setListStatus(false);
    };
    window.addEventListener("click", cb);
    return () => {
      window.removeEventListener("click", cb);
    };
  }, []);

  const handleSelected = e => {
    const value = e.target.dataset.value
    setSelected(value)
  }

  return (
    <div className={`selector-wrapper ${isVersion && 'version-wrapper'}`}>
      <div className="selected" onClick={toggleList}>
        {selected}
        <i className="fas fa-chevron-down arrow"></i>
      </div>
      <ul className={`options-wrapper ${listStatus && "open"}`} onClick={handleSelected} >
        {options.map(v => (
          <li className={v === selected ? "active" : ""} key={v} data-value={v}>
            {
              isVersion ? <LocalizeLink
                locale={locale}
                className="text"
                to={`/docs/${v}/about_milvus/overview.md`}
              >
                {v}
              </LocalizeLink>
                : <span data-value={v}>{v}</span>
            }
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Selector;
