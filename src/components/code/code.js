import React, { useState } from "react";
import PropTypes from "prop-types";
import * as styles from "./code.module.less";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import Tooltip from "@mui/material/Tooltip";

const Code = ({ html, content, tooltip = {} }) => {
  const [isCopied, setIscopied] = useState(false);

  const { copy: copyText = "copy", copied: copiedText = "copied" } = tooltip;

  const handleButtonsContent = e => {
    if (isCopied) {
      return;
    }
    setIscopied(true);
    setTimeout(() => {
      setIscopied(false);
    }, 2000);
  };

  const formatContent = content => {
    const code = content
      .split("\n")
      .filter(item => item[0] !== "#")
      .map(str => {
        const invalidItems = ["$", ">>>"];
        return str
          .split(" ")
          .filter(s => !invalidItems.includes(s))
          .join(" ");
      })
      .join("\n");

    return code;
  };

  const onButtonClick = e => {
    handleButtonsContent(e);
    const code = formatContent(content);
    copyToClipboard(code);
  };

  const copyToClipboard = content => {
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

  return (
    <>
      <div
        className={`${styles.codeSection}`}
        dangerouslySetInnerHTML={{ __html: html }}
      ></div>

      {/* <button className={styles.copyBtn} onClick={onButtonClick}>
        {isCopied ? (
          <FontAwesomeIcon icon={faCheck} />
        ) : (
          <FontAwesomeIcon icon={faCopy} />
        )}
      </button> */}
      <Tooltip title={isCopied ? copiedText : copyText} arrow placement="top">
        <button className={styles.copyBtn} onClick={onButtonClick}>
          {isCopied ? (
            <FontAwesomeIcon icon={faCheck} />
          ) : (
            <FontAwesomeIcon icon={faCopy} />
          )}
        </button>
      </Tooltip>
    </>
  );
};

Code.prototypes = {
  html: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
};

export default Code;
