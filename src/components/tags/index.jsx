import React from "react";

const Tags = (props) => {
  const {
    tagsClass = "",
    list,
    onClick = () => { },
    genTagClass = () => { },
  } = props;
  return (
    <ul className={tagsClass}>
      {list.map((tag) => (
        <li
          key={tag}
          onClick={() => onClick(tag)}
          onKeyDown={() => onClick(tag)}
          className={genTagClass(tag)}
          role="button"
          tabIndex={0}
        >
          {tag}
        </li>
      ))}
    </ul>
  );
};

export default Tags;
