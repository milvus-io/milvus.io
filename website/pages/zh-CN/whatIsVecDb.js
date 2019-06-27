/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

function Help(props) {
  const {config: siteConfig, language = ''} = props;
  const {baseUrl, docsUrl} = siteConfig;
  const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
  const langPart = `${language ? `${language}/` : ''}`;
  const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

  const Landing = () => {
    return (
  <section className="fdb-block">
    <div className="container">
      <div className="row align-items-center pb-xl-5">
        <div className="col-12 col-md-7 col-xl-5">
          <h1>What is Vector Database</h1>
          <p className="lead">Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean.</p>
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
