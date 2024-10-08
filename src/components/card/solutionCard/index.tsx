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
}> = ({ img, title, content, href, className = '', liveDemo = '' }) => {
  const handleTryDemo = link => {
    window.open(link, '_self');
  };

  return (
    <div tabIndex={0} className={clsx(styles.solutionCard, className)}>
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.linkWrapper}
      >
        <div>
          {img ? <img src={img} alt={title} className={styles.img} /> : null}
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.content}>{content}</p>
        </div>
        {liveDemo && (
          <CustomButton
            className={styles.demoBtn}
            endIcon={<RightWholeArrow />}
            variant="text"
          >
            Live Demo
          </CustomButton>
        )}
      </Link>
    </div>
  );
};

export default SolutionCard;
