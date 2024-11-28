import * as classes from './index.module.less';
import clsx from 'clsx';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useActivateAnchorWhenScroll } from '../../../hooks/blog';
import Share from '../../../components/share';
import CloudAdvertisementCard from '@/components/card/advCard';

export default function BlogAnchorSection(props) {
  const {
    classes: customClasses = {},
    anchors = [],
    shareUrl,
    title,
    description,
    container,
    imgUrl,
    id,
  } = props;
  const { root = '' } = customClasses;

  // label maybe duplicate, we use href as unique key to show active style
  const [activeAnchor, setActiveAnchor] = useState('');

  const handleChooseAnchor = href => {
    if (!href) {
      return;
    }
    setActiveAnchor(href);
  };

  const handleAnchorClick = (href) => {
    document.querySelector(`#${href}`).scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
    handleChooseAnchor(href);
    history.pushState(null, null, `#${href}`);
  }

  useEffect(() => {
    if (anchors[0]) {
      handleChooseAnchor(anchors[0].href);
    }
  }, [anchors]);

  useActivateAnchorWhenScroll({
    articleContainer: container,
    activeAnchorCb: handleChooseAnchor,
    anchorList: anchors,
  });

  return (
    <div className={clsx(classes.sectionContainer, root)}>
      <ul className={classes.listWrapper}>
        {anchors.length ? (
          <h3 className={classes.anchorTitle}>On This Page</h3>
        ) : null}

        {anchors.map((v, idx) => {
          const { label, href } = v;

          return (
            <li key={v.label + idx}>
              <a
                onClick={() => handleAnchorClick(href)}
                // href={`#${href}`}
                className={clsx(classes.anchorLink, {
                  [classes.activeAnchor]: href === activeAnchor,
                })}
              >
                {label}
              </a>
            </li>
          );
        })}
      </ul>

      <CloudAdvertisementCard className={classes.advCard} />

      <div className="">
        <Share
          url={shareUrl}
          quote={title}
          desc={description}
          image={imgUrl}
          wrapperClass={classes.share}
        />
      </div>
    </div>
  );
}
