import React from 'react';
import classes from './gitCommit.module.css';

export default function GitCommitInfo(props) {
  const { commitInfo = {}, mdId, commitTrans = 'was last updated at' } = props;

  return (
    <div className={classes.commitInfoWrapper}>
      <a target="_blank" rel="noopener" href={commitInfo.source}>
        {mdId}
      </a>
      <span>{` ${commitTrans} ${commitInfo.date}: `}</span>
      <a target="_blank" rel="noopener" href={commitInfo.commitUrl}>
        {commitInfo.message}
      </a>
    </div>
  );
}
