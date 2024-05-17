import MenuTree from '@/components/tree';
import VersionSelector from '@/components/versionSelector';
import { AlgoliaSearch } from '@/components/search/agloia';
import clsx from 'clsx';
import classes from './index.module.less';
import ExpansionTreeView from '@/components/treeView/ExpansionTreeView';

import {
  AllMdVersionIdType,
  ApiReferenceRouteEnum,
  FinalMenuStructureType,
} from '@/types/docs';

interface LeftNavSectionProps {
  tree: FinalMenuStructureType[];
  className?: string;
  version: string;
  latestVersion: string;
  versions?: string[];
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
  } = props;

  return (
    <div
      className={clsx(classes.menuContainer, {
        [customClassName]: customClassName,
      })}
    >
      {!disableSearch && <AlgoliaSearch version={version} />}
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
