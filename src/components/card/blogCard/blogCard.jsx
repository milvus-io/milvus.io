import React from 'react';
import { useMobileScreen } from '../../../hooks';
import './blogCard.scss';

const BlogCard = ({ data, wrapperClass = '' }) => {
  const { title, abstract, imgSrc, time } = data;
  const screenWidth = useMobileScreen();

  return (
    <div className={`blog-wrapper ${wrapperClass}`}>
      <div className="blog-content">
        <p className="blog-content-time">{time}</p>
        <h2>{title}</h2>
        <p className="blog-content-abstract">{abstract}</p>
      </div>
      {
        screenWidth > 1000 ? <img src={imgSrc} alt="blog" /> : null
      }

    </div>
  );
};

export default BlogCard;
