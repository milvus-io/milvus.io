/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

class Footer extends React.Component {
  docUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    const docsUrl = this.props.config.docsUrl;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    return `${baseUrl}${docsPart}${langPart}${doc}`;
  }

  pageUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + (language ? `${language}/` : '') + doc;
  }

  render() {
    return (
      <footer className="nav-footer" id="footer">
        <section className="sitemap">
          <a href={this.props.config.baseUrl} className="nav-home">
            {this.props.config.footerIcon && (
              <img
                src={this.props.config.baseUrl + this.props.config.footerIcon}
                alt={this.props.config.title}
                width="66"
                height="58"
              />
            )}
          </a>
          <div>
            <h5>Docs</h5>
            <a href={this.docUrl('QuickStart', this.props.language)}>
              Getting Started
            </a>
            <a href={this.docUrl('userguide/preface', this.props.language)}>
              Guides
            </a>
          </div>
          {/* <div>
            <h5>Others</h5>
            <a
              href="https://github.com/milvus-io/pymilvus"
              target="_blank"
              rel="noreferrer noopener">
              pymilvus</a>
                <a
              href="https://twitter.com/"
              target="_blank"
              rel="noreferrer noopener">
              Twitter
            </a>
          </div> */}
          {/* <div>
            <h5>More</h5>
            <a href={`${this.props.config.baseUrl}blog`}>Blog</a>
            
          </div> */}
          <div>
            <h5>Zilliz Product</h5>
            <a href={`#`}>Milvus</a>
            <a href={`http://www.zilliz.com/`}>Megawise</a>
            <a href={`http://www.zilliz.com/`}>Mega-learning</a>
          </div>
        </section>
        <section className="copyright">{this.props.config.copyright}</section>
        <script src="https://cookiehub.net/cc/99f12643.js"></script>
        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-142992812-1"></script>
      </footer>
    );
  }
}

module.exports = Footer;
