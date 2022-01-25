import React, { useState, useEffect } from "react";
import { globalHistory } from "@reach/router";

import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import clsx from "clsx";
import * as styles from "./scoredFeedback.module.less";
import { readStatisData, writeStatisData } from "../../http";

export default function ScoredFeedback(props) {
  const { pageId, trans } = props;

  const [score, setScore] = useState("");

  const scoreQuestion = trans("v3trans.docs.scoreQuestion");
  const scoreThanks = trans("v3trans.docs.scoreThanks");

  const { pathname } = globalHistory.location;

  const getLocalStorageItem = (itemName = "feedback_info", keyName) => {
    const infoString = window.localStorage.getItem(itemName);
    const info = infoString ? JSON.parse(infoString) : {};
    const detail = info[keyName];
    return detail;
  };

  const setLocalStorageItem = (itemName = "feedback_info", keyName, value) => {
    const infoString = window.localStorage.getItem(itemName);
    const info = infoString ? JSON.parse(infoString) : {};
    const newInfo = { ...info, [keyName]: value };
    window.localStorage.setItem(itemName, JSON.stringify(newInfo));
  };

  const cleanScore = () => {
    setLocalStorageItem("feedback_info", pageId, "");
    setScore("");
  };

  /**
   *
   * @param {string} value Target 'like' or 'dislike' count that will be increased.
   * @param {bool} isIncrease Default is True. Set to false then target count will be decreased.
   * @param {string} swapValue Target count will increase and another will decrease at the same time.
   */
  const handleUpdateStatisData = async (
    value,
    isIncrease = true,
    swapValue = ""
  ) => {
    const { statistic, sha } = await readStatisData();
    const info = statistic[value];
    let content = {};

    if (swapValue) {
      const swapInfo = statistic[swapValue];
      const currentCount = pathname in info ? info[pathname] + 1 : 1;
      const currentSwapCount =
        pathname in swapInfo ? swapInfo[pathname] - 1 : 0;
      content = {
        ...statistic,
        [value]: { ...info, [pathname]: currentCount },
        [swapValue]: { ...swapInfo, [pathname]: currentSwapCount },
      };
    } else {
      const currentPathnameCount = pathname in info ? info[pathname] : 1;
      const newPathnameCount = isIncrease
        ? currentPathnameCount + 1
        : currentPathnameCount - 1;
      content = {
        ...statistic,
        [value]: { ...info, [pathname]: newPathnameCount },
      };
    }

    writeStatisData({
      sha,
      content: window.btoa(JSON.stringify(content)),
      message: "update statistic data",
    });
  };

  useEffect(() => {
    try {
      const feedbackDetail = getLocalStorageItem("feedback_info", pageId);
      feedbackDetail && setScore(feedbackDetail);
    } catch (error) {
      console.log(error);
    }
  }, [pageId]);

  const handleScoreBtnClick = (value) => {
    if (score === value) {
      handleUpdateStatisData(value, false);
      cleanScore();
      return;
    }
    if (score && score !== value) {
      setLocalStorageItem("feedback_info", pageId, value);
      handleUpdateStatisData(value, true, score);
      setScore(value);
      return;
    }
    setLocalStorageItem("feedback_info", pageId, value);
    setScore(value);
    handleUpdateStatisData(value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>{score ? scoreThanks : scoreQuestion}</div>
      <BtnGroups
        trans={trans}
        score={score}
        onScoreBtnClick={handleScoreBtnClick}
      />
    </div>
  );
}

const BtnGroups = (props) => {
  const { score, onScoreBtnClick, trans } = props;

  return (
    <div className={styles.btnGroup}>
      <button
        className={clsx(styles.btn, {
          primaryBtnSm: score === "like",
          secondaryBtnSm: score !== "like",
        })}
        onClick={() => {
          onScoreBtnClick("like");
        }}
      >
        <ThumbUpOffAltIcon />
        {trans("v3trans.docs.yes")}
      </button>
      <button
        className={clsx(styles.btn, {
          primaryBtnSm: score === "dislike",
          secondaryBtnSm: score !== "dislike",
        })}
        onClick={() => {
          onScoreBtnClick("dislike");
        }}
      >
        <ThumbDownOffAltIcon />
        {trans("v3trans.docs.no")}
      </button>
    </div>
  );
};
