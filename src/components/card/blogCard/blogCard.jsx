import React from 'react';
import './blogCard.scss';
import { useMobileScreen } from '../../../hooks/index';

const BlogCard = ({ data, wrapperClass = '' }) => {
  const { title, abstract, imgSrc, time } = data;
  const { isMobile } = useMobileScreen();

  return (
    <div className={`blog-wrapper ${wrapperClass}`}>
      <div className="blog-content">
        <p className="blog-content-time">{time}</p>
        <h2>{title}</h2>
        <p className="blog-content-abstract">{abstract}</p>
      </div>
      {!isMobile && <img src={imgSrc} alt="blog" />}
    </div>
  );
};

export default BlogCard;
