/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const classNames = require('classnames');

const CompLibrary = require('../../core/CompLibrary.js');

const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

class CustomGridBlock extends GridBlock {
  constructor(props){
    super(props)
  }
  renderBlock(origBlock) {
    const blockDefaults = {
      imageAlign: 'left',
    };

    const block = Object.assign({},blockDefaults,origBlock);

    const blockClasses = classNames('blockElement', this.props.className, {
      alignCenter: this.props.align === 'center',
      alignRight: this.props.align === 'right',
      fourByGridBlock: this.props.layout === 'fourColumn',
      imageAlignSide:
        block.image &&
        (block.imageAlign === 'left' || block.imageAlign === 'right'),
      imageAlignTop: block.image && block.imageAlign === 'top',
      imageAlignRight: block.image && block.imageAlign === 'right',
      imageAlignBottom: block.image && block.imageAlign === 'bottom',
      imageAlignLeft: block.image && block.imageAlign === 'left',
      threeByGridBlock: this.props.layout === 'threeColumn',
      twoByGridBlock: this.props.layout === 'twoColumn',
      customBlock: typeof('ahhhhh') == 'string'
    });

    const topLeftImage =
      (block.imageAlign === 'top' || block.imageAlign === 'left') &&
      super.renderBlockImage(block.image, block.imageLink, block.imageAlt);

    const bottomRightImage =
      (block.imageAlign === 'bottom' || block.imageAlign === 'right') &&
      super.renderBlockImage(block.image, block.imageLink, block.imageAlt);

    return (
      <div className={blockClasses} key={block.title}>
        {topLeftImage}
        <div className="blockContent customBlockContent">
          {this.renderBlockTitle(block.title)}
          <MarkdownBlock>{block.content}</MarkdownBlock>
        </div>
        {bottomRightImage}
      </div>
    );
  }
  renderBlockTitle(title) {
    if (!title) {
      return null;
    }

    return (
      <h2 className='customGridBlockH2'>
        <MarkdownBlock >{title}</MarkdownBlock>
      </h2>
    );
  }
  render(){
    return(
      <div className="gridBlock">
        {this.props.contents.map(this.renderBlock, this)}
      </div>
    )
  }
  
}

class HomeSplash extends React.Component {
  render() {
    const {siteConfig, language = ''} = this.props;
    const {baseUrl, docsUrl} = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

    const SplashContainer = props => (
      <div className="homeContainer">
        <div className="homeSplashFade customHomeSplash">
          <div className="wrapper homeWrapper customHomeWrapper">{props.children}</div>
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
      <div className="pluginWrapper buttonWrapper customButtonWrapper">
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
            <Button href="https://mailchi.mp/ec7815c115bc/milvus-download">Download</Button>
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
        <CustomGridBlock
          align="center"
          contents={props.children}
          layout={props.layout}
        />
      </Container>
    );

    const FeatureCallout = () => (
      <div
        className="productShowcaseSection paddingTop paddingBottom"
        style={{textAlign: 'center'}}>
        <h2>What is Vector Database</h2>
        <div style={{lineHeight: '28px'}}>
        Feature vector, the fundamental abstraction of concerned objects in the realm of AI/ML. <br />
        Milvus vector database is designed to fulfill the management requirements of massive feature vectors generated in the AI/ML process.  <br />
        By efficiently storing and indexing the feature vectors, Milvus could help to optimize the vector matching performance in a large scale. <br />

        </div>
      </div>
    );

    const Architecture = () => (
      <div
        className="productShowcaseSection paddingTop paddingBottom"
        style={{textAlign: 'center'}}>
        <h2>Milvus Architecture</h2>
        <div style={{lineHeight: '28px'}}>
          <a href="/doc/doc1.html"><img width="50%" src={`./` + baseUrl + `/img/megasearch_arch.svg`} /></a>
        </div>
      </div>
    );


    const Features = () => (
      <div className="lightBackground">
      <Block layout="fourColumn">
        {[
          {
            content: 'Milvus could support the fearture vectors generated by major AI/ML framework',
            image: `${baseUrl}img/artificial-intelligence.svg`,
            imageAlign: 'top',
            title: 'AI Native',
          },
          {
            content: 'Milvus achieves great peformance with lower cost by employing different types of computing power',
            image: `${baseUrl}img/circled.svg`,
            imageAlign: 'top',
            title: 'Heterogeneous computing',
          },
          {
            content: 'The distributed architecture of Milvus provids high availability and scale out capability',
            image: `${baseUrl}img/accesibility.svg`,
            imageAlign: 'top',
            title: 'Easey to Manage',
          },
          
          {
            content: 'Milvus runs on public/private/hybrid cloud and on edge server with selected ASIC',
            image: `${baseUrl}img/share.svg`,
            imageAlign: 'top',
            title: 'Deployment Freedom',
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
