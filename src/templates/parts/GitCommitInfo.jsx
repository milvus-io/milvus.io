import React from "react";

export default function GitCommitInfo(props) {
  const { commitInfo = {}, mdId, commitTrans = "was last updated at" } = props;
  return (
    <div className="commit-info-wrapper">
      <a target="_blank" rel="noreferrer" href={commitInfo.source}>
        {mdId}
      </a>
      <span>{` ${commitTrans} ${commitInfo.date}: `}</span>
      <a target="_blank" rel="noreferrer" href={commitInfo.commitUrl}>
        {commitInfo.message}
      </a>
    </div>
  );
}
