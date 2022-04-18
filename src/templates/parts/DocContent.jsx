import React, { useRef } from "react";
import ScoredFeedback from "../../components/scoredFeedback";
import GitCommitInfo from "./GitCommitInfo.jsx";
import { useGithubCommits } from "../../http/hooks";
import { useZChart } from "../../hooks/doc-dom-operation";

export default function DocContent(props) {
  const { commitPath, version, htmlContent, mdId, relatedKey, trans } = props;
  const contact = {
    slack: {
      label: "Discuss on Slack",
      link: "https://slack.milvus.io/",
    },
    github: {
      label: "Discuss on GitHub",
      link: "https://github.com/milvus-io/milvus/issues/",
    },
    follow: {
      label: "Follow up with me",
    },
    dialog: {
      desc: "Please leave your question here and we will be in touch.",
      placeholder1: "Your Email*",
      placeholder2: "Your Question*",
      submit: "Submit",
      title: "We will follow up on your question",
      invalid: "please input valid email and your question",
    },
    title: "Didn't find what you need?",
  };
  const docContentRef = useRef();

  const commitInfo = useGithubCommits({
    commitPath,
    version,
  });
  useZChart(docContentRef);

  return (
    <>
      <div className="doc-post-wrapper doc-style">
        <div
          ref={docContentRef}
          className="doc-post-content"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
        {commitInfo?.message && (
          <GitCommitInfo
            commitInfo={commitInfo}
            mdId={mdId}
            commitTrans={trans("v3trans.docs.commitTrans")}
          />
        )}
        <ScoredFeedback trans={trans} pageId={mdId} />
      </div>
    </>
  );
}
