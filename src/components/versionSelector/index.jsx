import * as classes from './index.module.less';
import Link from 'next/link';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const VERSION_REG = /^v\d/;

export default function VersionSelector(props) {
  const {
    versions = [],
    curVersion,
    homeLabel = 'Home',
    homeLink = '/docs',
    linkPrefix, // docs or api languages
    linkSuffix = '', // doc home or api About.md
    latestVersion,
    currentMdId,
  } = props;

  console.log('version selector latest version', latestVersion);

  const router = useRouter();

  const [detailPageId, setDetailPageId] = useState(currentMdId);

  /**
   * 2 situations:
   * 1. query.id === xx.md
   * 2. query.id === v.x.0.x
   * */

  const {
    query: { id = '' },
  } = router;

  useEffect(() => {
    if (id.includes('.md') && !linkSuffix.includes('.md')) {
      versions.map(v => {
        // how to test if the link is 404
        //  const urlWithMdId =
        // if 404 setDetailPageId('')
        // else setDetailPageId(currentMdId)
      });
    }
  }, [id]);

  return (
    <div className={classes.selectorWrapper}>
      <Link href={homeLink} className={classes.homeBtn}>
        {homeLabel}
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
        {versions.map(v => {
          return v === latestVersion ? (
            <MenuItem value={v} key={v}>
              <Link
                href={`${linkPrefix}`}
                className={clsx(classes.versionLink, {
                  [classes.disabledLink]: v === curVersion,
                })}
              >
                {v}
              </Link>
            </MenuItem>
          ) : (
            <MenuItem value={v} key={v}>
              <Link
                href={`${linkPrefix}/${v}/${linkSuffix}`}
                className={clsx(classes.versionLink, {
                  [classes.disabledLink]: v === curVersion,
                })}
              >
                {v}
              </Link>
            </MenuItem>
          );
        })}
      </Select>
    </div>
  );
}
