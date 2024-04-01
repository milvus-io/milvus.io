import React from 'react';
import styles from './index.module.less';
import Link from 'next/link';
import clsx from 'clsx';

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
        className={styles.topSection}
      >
        <div className={styles.titleBar}>
          <h3 className={styles.title}>{title}</h3>
          {img ? <img src={img} alt="icon" className={styles.img} /> : null}
        </div>

        <p className={styles.content}>{content}</p>
      </Link>

      {liveDemo && (
        <Link className={styles.demoBtn} href={liveDemo}>
          Live Demo
        </Link>
      )}
    </div>
  );
};

export default SolutionCard;
