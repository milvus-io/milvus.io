import React from "react";
import * as styles from "./index.module.less";

const formateList = (list, idx) => {
  const len = list.length;
  let res = [];
  if (len <= 7) return list;

  if (idx === 1 || idx === 2) {
    res = [].concat(list.slice(0, 3), "...", list[len - 1]);
  } else if (idx === 3) {
    res = [].concat(list.slice(0, 4), "...", list[len - 1]);
  } else if (idx > 3 && idx < len - 2) {
    let temp = list.slice(idx - 2, idx + 1);
    res = [].concat(1, "...", temp, "...", list[len - 1]);
  } else if (idx === len - 2) {
    res = [].concat(1, "...", list.slice(len - 4, len));
  } else {
    res = [].concat(1, "...", list.slice(len - 3, len));
  }
  return res;
};

const generateArray = (count, size) => {
  if (count === 0 || size === 0) return [];
  let n = 0;
  if (count % size === 0) {
    n = count / size;
  } else {
    n = count / size + 1;
  }
  return Array.from({ length: n }).map((_, k) => k + 1);
};

const Pagination = ({
  className = "",
  total = 0,
  pageSize,
  handlePageIndexChange,
  pageIndex,
}) => {
  const tempList = generateArray(total, pageSize);
  const navList = formateList(tempList, pageIndex);

  const handleChoosePage = (idx) => {
    if (idx === "...") return;
    let value = 0;
    switch (idx) {
      case "prev":
        if (pageIndex === 1) return;
        value = pageIndex - 1;
        break;
      case "next":
        if (pageIndex === navList.length) return;
        value = pageIndex + 1;
        break;

      default:
        value = idx;
        break;
    }
    handlePageIndexChange(value);
  };

  return (
    <div
      className={`${styles.pageinationWrapper} ${className ? className : ""}`}
    >
      <span
        role="button"
        tabIndex="-1"
        className={`${styles.iconWrapper} ${
          pageIndex === 1 ? styles.disabled : ""
        }`}
        onClick={() => {
          handleChoosePage("prev");
        }}
      >
        <span>&lt;</span>
        <span>Previous</span>
      </span>

      <ul className={styles.pagesList}>
        {navList.map((item, idx) => (
          <li key={item + idx}>
            <span
              role="button"
              tabIndex="-1"
              className={`${
                typeof item !== "number" ? styles.ellipsis : styles.pagesItem
              } ${item === pageIndex ? styles.active : ""} `}
              onClick={() => handleChoosePage(item)}
            >
              {item}
            </span>
          </li>
        ))}
      </ul>

      <span
        role="button"
        tabIndex="-1"
        className={`${styles.iconWrapper} ${
          pageIndex === tempList.length ? styles.disabled : ""
        }`}
        onClick={() => {
          handleChoosePage("next");
        }}
      >
        <span>&gt;</span>
        <span>Next</span>
      </span>
    </div>
  );
};
export default Pagination;
