import React from 'react';
import './blogCard.scss';

const BlogCard = ({ data, wrapperClass = '' }) => {
  const { title, abstract, imgSrc, time } = data;

  return (
    <div className={`blog-wrapper ${wrapperClass}`}>
      <div className="blog-content">
        <p className="blog-content-time">{time}</p>
        <h2>{title}</h2>
        <p className="blog-content-abstract">{abstract}</p>
      </div>
      <img src={imgSrc} alt="blog image" />
    </div>
  );
};

export default BlogCard;
