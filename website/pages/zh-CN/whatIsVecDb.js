/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

function Help(props) {
  const { config: siteConfig, language = '' } = props;
  const { baseUrl, docsUrl } = siteConfig;
  const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
  const langPart = `${language ? `${language}/` : ''}`;
  const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

  const Landing = () => {
    return (
      <section className="fdb-block">
        <div className="container">
          <div className="row align-items-center pb-xl-5">
            <div className="col-12 col-md-7 col-xl-5">
              <h1>什么是特征向量数据库</h1>
              <p className="lead">随着机器学习和深度学习技术越来越成熟，应用越来越广泛，随之而产生的特征向量数据也会越来越庞大，但目前看来，传统的数据库系统和大数据系统并不能满足海量特征向量检索的要求。原因有以下几方面：</p>
              <ul>
                <li>传统的数据库系统和大数据系统，其内建数据类型里并不包括特征向量类型。</li>
                <li>如果打算使用传统的数据库系统进行特征向量检索，要么自定义特征向量类型，以及针对该类型数据的自定义函数；要么就只能按照一维一列的方式把高维向量存入数据库系统。由于大多数数据库系统对于表列数的支持都是有限的，使用这种方法通常无法支持高维特征向量。</li>
                <li>传统的数据库和大数据系统里，除了没有针对该数据类型的存储方式、计算方法，也没有针对该类型的索引方式和数据的管理方式。</li>
              </ul>
              <p>综上所述，使用传统的数据库和大数据系统进行特征向量的存储和检索，都是不合适的。提供一个面向海量特征向量检索的数据库系统，已经是市场对于数据库厂商提出的新需求。这也是Milvus应运而生的主要原因。</p>
            </div>
            <div className="col-12 col-sm-6 col-md-4 m-sm-auto mr-md-0 ml-md-auto pt-4 pt-md-0">
              <img alt="splash" className="img-fluid" src={`${baseUrl}images/draws/developer.svg`} />
            </div>
          </div>

          <div className="row pt-5">
            <div className="col-12 col-sm-6 col-md-3">
              <h3><strong>Feature One</strong></h3>
              <p>Separated they live in Bookmarksgrove right at the coast of the Semantics, a large ocean.</p>
            </div>

            <div className="col-12 col-sm-6 col-md-3 pt-3 pt-sm-0">
              <h3><strong>Feature Two</strong></h3>
              <p>A small river named Duden flows by their place and supplies it with the necessary regelialia.</p>
            </div>

            <div className="col-12 col-sm-6 col-md-3 pt-3 pt-md-0">
              <h3><strong>Feature Three</strong></h3>
              <p>It is a paradisematic country, in which roasted parts of sentences fly into your mouth.</p>
            </div>

            <div className="col-12 col-sm-6 col-md-3 pt-3 pt-md-0">
              <h3><strong>Feature Four</strong></h3>
              <p>Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life.</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const CurrentTech = () => {
    return (
      <section className="fdb-block">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col col-md-8 text-center">
              <h1>Current Technoledge</h1>
              <p className="lead">Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life One day however a small line of blind text by the name of Lorem Ipsum decided to leave for the far World of Grammar.</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const WhyIsDifficult = () => {
    return (
      <section className="fdb-block">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col col-md-8 text-center">
              <h1>Why vector searching is Difficult</h1>
              <p className="lead">Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life One day however a small line of blind text by the name of Lorem Ipsum decided to leave for the far.</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <div>
      <Landing />
      <CurrentTech />
      <WhyIsDifficult />
    </div>
  );
}

module.exports = Help;
