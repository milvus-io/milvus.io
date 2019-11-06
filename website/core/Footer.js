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
          {this.props.language === "en" && (
            <>
              <div>
                <h5>Product</h5>
                <a
                  href={this.docUrl(
                    "aboutmilvus/overview",
                    this.props.language
                  )}
                >
                  Milvus
                </a>
                <a href={this.docUrl("roadmap", this.props.language)}>
                  Milvus Roadmap
                </a>
              </div>
              <div>
                <h5>Docs</h5>
                <a
                  href={this.docUrl(
                    "userguide/install_milvus",
                    this.props.language
                  )}
                >
                  Quick Start
                </a>
                <a href={this.docUrl("faq/product_faq", this.props.language)}>
                  FAQ
                </a>
                <a href={this.docUrl("release/v0.5.0", this.props.language)}>
                  Release Notes
                </a>
              </div>

              <div>
                <h5>Resources</h5>
                <a
                  target="_blank"
                  href={`https://github.com/milvus-io/milvus/issues`}
                >
                  Github
                </a>
                <a target="_blank" href={`https://medium.com/@milvusio`}>
                  Medium
                </a>
                <a target="_blank" href={`https://me.csdn.net/weixin_44839084`}>
                  CSDN
                </a>
                <a
                  target="_blank"
                  href={`https://github.com/milvus-io/bootcamp`}
                >
                  Milvus Bootcamp
                </a>
              </div>
              <div className="connect">
                <h5>Connect</h5>
                <a
                  className="twitter"
                  target="_blank"
                  href={`https://twitter.com/milvusio`}
                >
                  <svg
                    fill="#EEE"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                  Twitter
                </a>
                <a
                  className="facebook"
                  target="_blank"
                  href={`https://www.facebook.com/io.milvus.5`}
                >
                  <svg
                    fill="#EEE"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                  </svg>
                  Facebook
                </a>
                <a className="wechat">
                  <svg
                    fill="#EEE"
                    width="24"
                    height="24"
                    xmlns="http://www.w3.org/2000/svg"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                  >
                    <path d="M21.502 19.525c1.524-1.105 2.498-2.738 2.498-4.554 0-3.326-3.237-6.023-7.229-6.023s-7.229 2.697-7.229 6.023c0 3.327 3.237 6.024 7.229 6.024.825 0 1.621-.117 2.36-.33l.212-.032c.139 0 .265.043.384.111l1.583.914.139.045c.133 0 .241-.108.241-.241l-.039-.176-.326-1.215-.025-.154c0-.162.08-.305.202-.392zm-12.827-17.228c-4.791 0-8.675 3.236-8.675 7.229 0 2.178 1.168 4.139 2.997 5.464.147.104.243.276.243.471l-.03.184-.391 1.458-.047.211c0 .16.13.29.289.29l.168-.054 1.899-1.097c.142-.082.293-.133.46-.133l.255.038c.886.255 1.842.397 2.832.397l.476-.012c-.188-.564-.291-1.158-.291-1.771 0-3.641 3.542-6.593 7.911-6.593l.471.012c-.653-3.453-4.24-6.094-8.567-6.094zm5.686 11.711c-.532 0-.963-.432-.963-.964 0-.533.431-.964.963-.964.533 0 .964.431.964.964 0 .532-.431.964-.964.964zm4.82 0c-.533 0-.964-.432-.964-.964 0-.533.431-.964.964-.964.532 0 .963.431.963.964 0 .532-.431.964-.963.964zm-13.398-5.639c-.639 0-1.156-.518-1.156-1.156 0-.639.517-1.157 1.156-1.157.639 0 1.157.518 1.157 1.157 0 .638-.518 1.156-1.157 1.156zm5.783 0c-.639 0-1.156-.518-1.156-1.156 0-.639.517-1.157 1.156-1.157.639 0 1.157.518 1.157 1.157 0 .638-.518 1.156-1.157 1.156z" />
                  </svg>
                  WeChat
                  <img
                    style={{ maxWidth: "initial" }}
                    width="150"
                    height="150"
                    src="/images/qrcode.jpeg"
                  />
                </a>
              </div>
            </>
          )}
          {this.props.language === "zh-CN" && (
            <>
              <div>
                <h5>产品</h5>
                <a
                  href={this.docUrl(
                    "aboutmilvus/overview",
                    this.props.language
                  )}
                >
                  Milvus
                </a>
                <a href={this.docUrl("roadmap", this.props.language)}>
                  Milvus 路线图
                </a>
              </div>
              <div>
                <h5>文档</h5>
                <a
                  href={this.docUrl(
                    "userguide/install_milvus",
                    this.props.language
                  )}
                >
                  快速开始
                </a>
                <a href={this.docUrl("faq/product_faq", this.props.language)}>
                  FAQ
                </a>
                <a href={this.docUrl("release/v0.5.0", this.props.language)}>
                  版本说明
                </a>
              </div>

              <div>
                <h5>资源</h5>
                <a href={`https://github.com/milvus-io/milvus/issues`}>
                  Github
                </a>
                <a target="_blank" href={`https://medium.com/@milvusio`}>
                  Medium
                </a>
                <a target="_blank" href={`https://me.csdn.net/weixin_44839084`}>
                  CSDN
                </a>
                <a
                  target="_blank"
                  href={`https://github.com/milvus-io/bootcamp`}
                >
                  Milvus 在线训练营
                </a>
              </div>
              <div className="connect">
                <h5>联系我们
</h5>
                <a
                  className="twitter"
                  target="_blank"
                  href={`https://twitter.com/milvusio`}
                >
                  <svg
                    fill="#EEE"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                  Twitter
                </a>
                <a
                  className="facebook"
                  target="_blank"
                  href={`https://www.facebook.com/io.milvus.5`}
                >
                  <svg
                    fill="#EEE"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                  </svg>
                  Facebook
                </a>
                <a className="wechat">
                  <svg
                    fill="#EEE"
                    width="24"
                    height="24"
                    xmlns="http://www.w3.org/2000/svg"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                  >
                    <path d="M21.502 19.525c1.524-1.105 2.498-2.738 2.498-4.554 0-3.326-3.237-6.023-7.229-6.023s-7.229 2.697-7.229 6.023c0 3.327 3.237 6.024 7.229 6.024.825 0 1.621-.117 2.36-.33l.212-.032c.139 0 .265.043.384.111l1.583.914.139.045c.133 0 .241-.108.241-.241l-.039-.176-.326-1.215-.025-.154c0-.162.08-.305.202-.392zm-12.827-17.228c-4.791 0-8.675 3.236-8.675 7.229 0 2.178 1.168 4.139 2.997 5.464.147.104.243.276.243.471l-.03.184-.391 1.458-.047.211c0 .16.13.29.289.29l.168-.054 1.899-1.097c.142-.082.293-.133.46-.133l.255.038c.886.255 1.842.397 2.832.397l.476-.012c-.188-.564-.291-1.158-.291-1.771 0-3.641 3.542-6.593 7.911-6.593l.471.012c-.653-3.453-4.24-6.094-8.567-6.094zm5.686 11.711c-.532 0-.963-.432-.963-.964 0-.533.431-.964.963-.964.533 0 .964.431.964.964 0 .532-.431.964-.964.964zm4.82 0c-.533 0-.964-.432-.964-.964 0-.533.431-.964.964-.964.532 0 .963.431.963.964 0 .532-.431.964-.963.964zm-13.398-5.639c-.639 0-1.156-.518-1.156-1.156 0-.639.517-1.157 1.156-1.157.639 0 1.157.518 1.157 1.157 0 .638-.518 1.156-1.157 1.156zm5.783 0c-.639 0-1.156-.518-1.156-1.156 0-.639.517-1.157 1.156-1.157.639 0 1.157.518 1.157 1.157 0 .638-.518 1.156-1.157 1.156z" />
                  </svg>
                  WeChat
                  <img
                    style={{ maxWidth: "initial" }}
                    width="150"
                    height="150"
                    src="/images/qrcode.jpeg"
                  />
                </a>
              </div>
            </>
          )}
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
