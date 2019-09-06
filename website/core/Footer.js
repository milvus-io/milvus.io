/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require("react");

class Footer extends React.Component {
  docUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    const docsUrl = this.props.config.docsUrl;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ""}`;
    const langPart = `${language ? `${language}/` : ""}`;
    return `${baseUrl}${docsPart}${langPart}${doc}`;
  }

  pageUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + (language ? `${language}/` : "") + doc;
  }

  render() {
    return (
      <footer className="nav-footer" id="footer">
        <section className="sitemap">
          {/* no icon at the moment, hidden it for layout         */}
          {/* <a href={this.props.config.baseUrl} className="nav-home">
            {this.props.config.footerIcon && (
              <img
                src={this.props.config.baseUrl + this.props.config.footerIcon}
                alt={this.props.config.title}
                width="66"
                height="58"
              />
            )}
          </a> */}
          <div>
            <h5>Product</h5>
            <a href={this.docUrl("vectordb/milvus-db", this.props.language)}>
              Milvus
            </a>
            <a href="https://github.com/milvus-io/bootcamp">Milvus Bootcamp</a>
          </div>
          <div>
            <h5>Resources</h5>
            <a href={this.docUrl("QuickStart", this.props.language)}>Docs</a>
            <a
              href={`https://github.com/milvus-io/bootcamp/tree/master/solutions/hybrid_search`}
            >
              Solutions
            </a>
            <a href={this.docUrl("FAQ", this.props.language)}>FAQ</a>
          </div>
          <div>
            <h5>Support</h5>
            <a href={`https://github.com/milvus-io`}>Github</a>
            <a href={`https://www.milvus.io/blog/`}>Blog</a>
            <a href={`https://me.csdn.net/weixin_44839084`}>CSDN</a>
            <a href={`mailto:support@zilliz.com`}>Contact Us</a>
          </div>
          <div>
            <h5>Componay</h5>
            <a href={`https://zilliz.com/about-us/about-zilliz/`}>
              About Zilliz
            </a>
            <a href={`https://zilliz.com/careers/`}>Join Us</a>
            <a href={`https://zilliz.com/about-us/news/`}>News</a>
          </div>
          <div>
            <img style={{maxWidth: 'initial'}} width="150" height="150" src="https://www.zilliz.com/images/qrcode2.jpeg?ver=1.10.16" />
          </div>
        </section>
        <section className="copyright">{this.props.config.copyright}</section>
        <script src="https://cookiehub.net/cc/99f12643.js" />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=UA-142992812-1"
        />
      </footer>
    );
  }
}

module.exports = Footer;
