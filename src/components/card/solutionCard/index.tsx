import React from 'react';
import styles from './index.module.less';
import Link from 'next/link';
import clsx from 'clsx';
import CustomButton from '@/components/customButton';
import { RightWholeArrow } from '@/components/icons';

const SolutionCard: React.FC<{
  img?: string;
  title: string;
  content: string;
  href: string;
  className?: string;
  liveDemo?: string;
  ctaLabel?: string;
}> = ({
  img,
  title,
  content,
  href,
  className = '',
  liveDemo = '',
  ctaLabel = 'Learn More',
}) => {
  return (
    <div tabIndex={0} className={clsx(styles.solutionCard, className)}>
      <div rel="noopener noreferrer" className={styles.linkWrapper}>
        <div>
          {img ? <img src={img} alt={title} className={styles.img} /> : null}
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.content}>{content}</p>
        </div>
        <div className={styles.buttonsWrapper}>
          {href && (
            <CustomButton
              href={href}
              className={styles.LearnBtn}
              endIcon={<RightWholeArrow />}
              variant="outlined"
              target="_blank"
            >
              {ctaLabel}
            </CustomButton>
          )}
          {liveDemo && (
            <CustomButton
              className={styles.demoBtn}
              endIcon={<RightWholeArrow />}
              variant="text"
              target="_blank"
              href={liveDemo}
            >
              Live Demo
            </CustomButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default SolutionCard;
