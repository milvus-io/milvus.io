import React from 'react';
import GitCommitInfo from '../GitCommitInfo';
import { useGithubCommits } from '../../../http/hooks';
import classes from './index.module.less';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import Breadcrumb from '@/components/breadcrumb';
import DocPageActions from './DocPageActions';

interface DocContentPropsType {
  commitPath?: string;
  version: string;
  htmlContent: string;
  mdId: string;
  type: 'doc' | 'api';
  activeLabels: string[];
  latestVersion: string;
  apiCategory?: string;
  lang?: string;
}

export default function DocContent(props: DocContentPropsType) {
  const {
    commitPath = '',
    version,
    htmlContent,
    mdId,
    type,
    activeLabels,
    latestVersion,
    apiCategory,
    lang = 'en',
  } = props;
  const { t } = useTranslation('common');
  const { t: headerTrans } = useTranslation('header');

  const docLink = lang == 'en' ? `/docs` : `/docs/${lang}`;

  const prefixDocCrumbItems = [
    {
      label: headerTrans('docs'),
      href: version === latestVersion ? docLink : `${docLink}/${version}`,
    },
  ];

  const prefixApiCrumbItems = [
    ...prefixDocCrumbItems,
    {
      label: 'API Reference',
      href: `/api-reference/${apiCategory}/${version}/About.md`,
    },
  ];

  const prefixCrumbItems =
    type === 'doc' ? prefixDocCrumbItems : prefixApiCrumbItems;

  // const contact = {
  //   slack: {
  //     label: "Discuss on Slack",
  //     link: "https://slack.milvus.io/",
  //   },
  //   github: {
  //     label: "Discuss on GitHub",
  //     link: "https://github.com/milvus-io/milvus/issues/",
  //   },
  //   follow: {
  //     label: "Follow up with me",
  //   },
  //   dialog: {
  //     desc: "Please leave your question here and we will be in touch.",
  //     placeholder1: "Your Email*",
  //     placeholder2: "Your Question*",
  //     submit: "Submit",
  //     title: "We will follow up on your question",
  //     invalid: "please input valid email and your question",
  //   },
  //   title: "Didn't find what you need?",
  // };

  const commitInfo = useGithubCommits({
    commitPath,
    version,
  });

  return (
    <div className={classes.docPostWrapper}>
      <div className={classes.topBar}>
        <Breadcrumb
          list={[
            ...prefixCrumbItems,
            ...activeLabels.map(v => ({
              label: v,
            })),
          ]}
          lang={lang}
        />
        <DocPageActions githubLink={commitPath} />
      </div>
      <div
        className={clsx('doc-style', 'doc-post-content', {
          'api-reference-wrapper': type === 'api',
        })}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      ></div>
      {commitInfo?.message && (
        <GitCommitInfo
          commitInfo={commitInfo}
          mdId={mdId}
          commitTrans={t('v3trans.docs.commitTrans')}
        />
      )}
      {/* <ScoredFeedback trans={trans} pageId={mdId} /> */}
    </div>
  );
}
