import MenuTree from '../../../components/tree';
import VersionSelector from '../../../components/versionSelector';
import { AlgoliaSearch } from '../../../components/search/agloia';
import clsx from 'clsx';
import classes from './index.module.less';

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
      <MenuTree
        tree={tree}
        onNodeClick={onNodeClick}
        version={version}
        linkPrefix={linkPrefix}
      />
    </div>
  );
}
