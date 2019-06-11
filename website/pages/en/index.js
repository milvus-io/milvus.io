/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

class HomeSplash extends React.Component {
  render() {
    const {siteConfig, language = ''} = this.props;
    const {baseUrl, docsUrl} = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

    const SplashContainer = props => (
      <div className="homeContainer">
        <div className="homeSplashFade">
          <div className="wrapper homeWrapper">{props.children}</div>
        </div>
      </div>
    );

    const Logo = props => (
      <div className="projectLogo">
        <img src={props.img_src} alt="Project Logo" />
      </div>
    );

    const ProjectTitle = () => (
      <h1 className="projectTitle">
        {siteConfig.title}
        <small>{siteConfig.tagline}</small>
      </h1>
    );

    const PromoSection = props => (
      <div className="section promoSection">
        <div className="promoRow">
          <div className="pluginRowBlock">{props.children}</div>
        </div>
      </div>
    );

    const Button = props => (
      <div className="pluginWrapper buttonWrapper">
        <a className="button" href={props.href} target={props.target}>
          {props.children}
        </a>
      </div>
    );

    return (
      <SplashContainer>
        <div className="inner">
          <ProjectTitle siteConfig={siteConfig} />
          <PromoSection>
            <Button href="/docs/doc1">GET STARTED </Button>
            <Button href="#">Download</Button>
            {/* <Button href={docUrl('doc1.html')}>Example Link</Button> */}
            {/* <Button href={docUrl('doc2.html')}>Example Link 2</Button> */}
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

class Index extends React.Component {
  render() {
    const {config: siteConfig, language = ''} = this.props;
    const {baseUrl} = siteConfig;

    const Block = props => (
      <Container
        padding={['bottom', 'top']}
        id={props.id}
        background={props.background}>
        <GridBlock
          align="center"
          contents={props.children}
          layout={props.layout}
        />
      </Container>
    );

    const FeatureCallout = () => (
      <div
        className="productShowcaseSection paddingTop paddingBottom"
        style={{textAlign: 'center', background: '#F8F8F8'}}>
        <h2>What is Vector Database</h2>
        <div style={{lineHeight: '28px'}}>
          Milvus 是Zilliz公司为应对AI应⽤⼤规模落地，而研制的面向海量特征向量检索的数据库系统。
          <br />
          Milvus 旨在帮助⽤户实现⾮结构化数据的近似检索和分析，<br />
          其实现原理是通过AI算法提取⾮结构化数据的特征，然后利用特征向量量唯⼀一标识该⾮结构化数据，然后⽤向量间的距离衡量⾮结构化数据之间的相似度。
        </div>
      </div>
    );

    const Architecture = () => (
      <div
        className="productShowcaseSection paddingTop paddingBottom"
        style={{textAlign: 'center'}}>
        <h2>Milvus Architecture</h2>
        <div style={{lineHeight: '28px'}}>
          
        </div>
      </div>
    );

    const TryOut = () => (
      <Block id="try">
        {[
          {
            content:
              'To make your landing page more attractive, use illustrations! Check out ' +
              '[**unDraw**](https://undraw.co/) which provides you with customizable illustrations which are free to use. ' +
              'The illustrations you see on this page are from unDraw.',
            image: `${baseUrl}img/undraw_code_review.svg`,
            imageAlign: 'left',
            title: 'Wonderful SVG Illustrations',
          },
        ]}
      </Block>
    );

    const Description = () => (
      <Block background="dark">
        {[
          {
            content:
              'This is another description of how this project is useful',
            image: `${baseUrl}img/undraw_note_list.svg`,
            imageAlign: 'right',
            title: 'What is Vector Database',
          },
        ]}
      </Block>
    );

    const LearnHow = () => (
      <Block background="light">
        {[
          {
            content:
              'Each new Docusaurus project has **randomly-generated** theme colors.',
            image: `${baseUrl}img/undraw_youtube_tutorial.svg`,
            imageAlign: 'right',
            title: 'Randomly Generated Theme Colors',
          },
        ]}
      </Block>
    );

    const Features = () => (
      <div className="lightBackground">
      <Block layout="fourColumn">
        {[
          {
            content: 'GPU-accelerated ANNS',
            image: `${baseUrl}img/undraw_react.svg`,
            imageAlign: 'top',
            title: 'Cost Efficient',
          },
          {
            content: 'Automatic partition and scale-out',
            image: `${baseUrl}img/undraw_react.svg`,
            imageAlign: 'top',
            title: 'Scalable',
          },
          {
            content: 'RESTful, gRPC, Python, C++',
            image: `${baseUrl}img/undraw_react.svg`,
            imageAlign: 'top',
            title: 'Easy to Use',
          },
          
          {
            content: 'RESTful, gRPC, Python, C++',
            image: `${baseUrl}img/undraw_react.svg`,
            imageAlign: 'top',
            title: 'Easy to Use',
          },
        ]}
      </Block>
      </div>
    );

    const Showcase = () => {
      if ((siteConfig.users || []).length === 0) {
        return null;
      }

      const showcase = siteConfig.users
        .filter(user => user.pinned)
        .map(user => (
          <a href={user.infoLink} key={user.infoLink}>
            <img src={user.image} alt={user.caption} title={user.caption} />
          </a>
        ));

      const pageUrl = page => baseUrl + (language ? `${language}/` : '') + page;

      return (
        <div className="productShowcaseSection paddingBottom">
          <h2>Who is Using This?</h2>
          <p>This project is used by all these people</p>
          <div className="logos">{showcase}</div>
          <div className="more-users">
            <a className="button" href={pageUrl('users.html')}>
              More {siteConfig.title} Users
            </a>
          </div>
        </div>
      );
    };

    return (
      <div>
        <HomeSplash siteConfig={siteConfig} language={language} />
        <div className="mainContainer">
          <FeatureCallout />
          <Architecture />
          <div className="productShowcaseSection">
            <Features />
          </div>
        </div>
      </div>
    );
  }
}

module.exports = Index;
