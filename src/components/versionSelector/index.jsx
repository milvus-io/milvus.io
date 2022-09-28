import * as classes from './index.module.less';
import Link from 'next/link';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import clsx from 'clsx';

export default function VersionSelector(props) {
  const {
    versions = [],
    curVersion,
    homeLabel = 'Home',
    homeLink = '/docs',
    linkPrefix, // docs or api languages
    linkSurfix = '', // doc home or api About.md
  } = props;

  return (
    <div className={classes.selectorWrapper}>
      <Link href={homeLink}>
        <a className={classes.homeBtn}>{homeLabel}</a>
      </Link>

      <Select
        value={curVersion}
        onChange={data => {
          console.log(data);
        }}
        classes={{
          select: classes.selectRoot,
        }}
      >
        {versions.map(v => (
          <MenuItem value={v} key={v}>
            <Link href={`${linkPrefix}/${v}/${linkSurfix}`}>
              <a
                className={clsx(classes.versionLink, {
                  [classes.disabledLink]: v === curVersion,
                })}
              >
                {v}
              </a>
            </Link>
          </MenuItem>
        ))}
      </Select>
    </div>
  );
}
