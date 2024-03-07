import MenuTree from '@/components/tree';
import VersionSelector from '@/components/versionSelector';
import { AlgoliaSearch } from '@/components/search/agloia';
import clsx from 'clsx';
import classes from './index.module.less';
import ExpansionTreeView from '@/components/treeView/ExpansionTreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export default function LeftNavSection(props) {
  const {
    tree,
    onNodeClick,
    className: customClassName,
    version,
    versions = [],
    linkPrefix,
    linkSuffix,
    trans,
    locale = 'en',
    home: { label, link },
    currentMdId,
    groupId = '',
  } = props;

  return (
    <div
      className={clsx(classes.menuContainer, {
        [customClassName]: customClassName,
      })}
    >
      <AlgoliaSearch locale={locale} version={version} trans={trans} />
      <VersionSelector
        versions={versions}
        curVersion={version}
        homeLabel={label}
        homeLink={link}
        linkPrefix={linkPrefix}
        linkSuffix={linkSuffix}
      />

      <ExpansionTreeView
        itemList={tree}
        treeClassName={classes.tree}
        itemClassName={classes.treeItem}
        linkClassName={classes.treeItemLink}
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        homeUrl={link}
        homeLabel={label}
        showHome={true}
        currentMdId={currentMdId}
        groupId={groupId}
        language={locale}
        version={version}
        linkPrefix={linkPrefix}
      />
    </div>
  );
}
