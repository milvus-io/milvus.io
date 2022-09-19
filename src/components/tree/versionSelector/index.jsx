import * as classes from './index.module.less';
import Link from 'next/link';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export default function VersionSelector(props) {
  const {
    versions = [],
    curVersion,
    homeLabel = 'Home',
    linkPrefix,
    linkSurfix = '',
  } = props;

  return (
    <div className={classes.selectorWrapper}>
      <Link href="/docs">
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
              <a className={classes.versionLink}>{v}</a>
            </Link>
          </MenuItem>
        ))}
      </Select>
    </div>
  );
}

{
  /* <div onClick={handleClick} className={classes.selectRoot}>
        <span>{curVersion}</span>
        <span className={classes.triangle}></span>
      </div>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {versionOptions.map(v => (
          <Link href={v.href} key={v.label}>
            <a>
              <MenuItem value={v.value}>{v.label}</MenuItem>
            </a>
          </Link>
        ))}
      </Menu> */
}
