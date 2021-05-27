import React from 'react';
import BannerCard from '../../components/card/bannerCard';
import logo from '../../images/ask_milvus.png';

const Test = () => {
  return (
    <div>
      <BannerCard
        title='About Milvus Bootcamp'
        contentList={['Milvus is the world most popular open-source vector database. It aims to help users deal with the challenges that comes with massive-scale, unstructured through the following methods: ', 'High-performance, high-precision and scalable search of vectors; Similarity search and analysis of unstructured data.']}
        img={logo}
      >
      </BannerCard>
    </div>
  );
};

export default Test;