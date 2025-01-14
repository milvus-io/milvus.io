import { AlgoliaSearch } from '@/components/search/agloia';
import ExpansionTreeView from '@/components/treeView/ExpansionTreeView';
import VersionSelector from '@/components/versionSelector';
import { LanguageEnum } from '@/types/localization';
import {
  AllMdVersionIdType,
  ApiReferenceRouteEnum,
  FinalMenuStructureType,
} from '@/types/docs';
import clsx from 'clsx';

import '@docsearch/css';
import 'instantsearch.css/themes/reset.css';

import classes from './index.module.less';

interface LeftNavSectionProps {
  tree: FinalMenuStructureType[];
  className?: string;
  version: string;
  latestVersion: string;
  versions?: string[];
  lang?: LanguageEnum;
  type: 'doc' | 'api';
  currentMdId: string;
  homepageConf: {
    label: string;
    link: string;
  };
  groupId?: string;
  mdListData: AllMdVersionIdType[];
  category?: ApiReferenceRouteEnum;
  disableSearch?: boolean;
}

export default function LeftNavSection(props: LeftNavSectionProps) {
  const {
    tree,
    className: customClassName,
    version,
    versions = [],
    latestVersion,
    type,
    homepageConf,
    currentMdId,
    groupId = '',
    mdListData,
    category,
    disableSearch = false,
    lang,
  } = props;

  return (
    <div
      className={clsx(classes.menuContainer, {
        [customClassName]: customClassName,
      })}
    >
      {!disableSearch && <AlgoliaSearch version={version} locale={lang} />}
      <VersionSelector
        versions={versions}
        curVersion={version}
        homepageConf={homepageConf}
        type={type}
        latestVersion={latestVersion}
        currentMdId={currentMdId}
        mdListData={mdListData}
        category={category}
      />

      <ExpansionTreeView
        itemList={tree}
        classes={{
          tree: classes.tree,
          item: classes.treeItem,
          link: classes.treeItemLink,
        }}
        lang={lang}
        homepageConf={homepageConf}
        showHomeButton
        currentMdId={currentMdId}
        groupId={groupId}
        version={version}
        latestVersion={latestVersion}
        type={type}
        category={category}
      />
    </div>
  );
}
