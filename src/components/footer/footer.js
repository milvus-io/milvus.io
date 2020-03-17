import React from "react"
import PropTypes from "prop-types"
import LocalizeLink from "../localizedLink/localizedLink"
import Qcode from "../../images/qrcode.jpeg"
import MilvusUserWechat from "../../images/milvus-user-wechat.png"

import "./footer.scss"
/* eslint-disable */
const Footer = ({ language, locale }) => {
  const { footer } = language
  return (
    <footer className="footer-wrapper">
      <div className="content">
        <ul>
          <li className="title">{footer.product.title}</li>
          <LocalizeLink
            locale={locale}
            className="text"
            to={"/docs/about_milvus/overview.md"}
          >
            {footer.product.txt1}
          </LocalizeLink>
          {/* <LocalizeLink
            locale={locale}
            className="text"
            to={"/docs/roadmap.md"}
          >
            {footer.product.txt2}
          </LocalizeLink> */}
        </ul>
        <ul>
          <li className="title">{footer.doc.title}</li>
          <LocalizeLink
            locale={locale}
            className="text"
            to={"/docs/guides/get_started/install_milvus/install_milvus.md"}
          >
            {footer.doc.txt1}
          </LocalizeLink>
          <LocalizeLink
            locale={locale}
            className="text"
            to={"/docs/faq/product_faq.md"}
          >
            {footer.doc.txt2}
          </LocalizeLink>
          {/* <LocalizeLink
            locale={locale}
            className="text"
            to={`/docs/releases/v0.6.0.md`}
          >
            {footer.doc.txt3}
          </LocalizeLink> */}
        </ul>
        <ul>
          <li className="title">{footer.tool.title}</li>
          <a
            className="text"
            href="/tools/sizing"
            target="_blank"
            rel="noopener noreferrer"
          >
            {footer.tool.txt1}
          </a>
        </ul>
        <ul>
          <li className="title">{footer.resource.title}</li>
          <a
            href="https://github.com/milvus-io/milvus/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="text"
          >
            {footer.resource.txt1}
          </a>
          <a
            href="https://medium.com/@milvusio"
            target="_blank"
            rel="noopener noreferrer"
            className="text"
          >
            {footer.resource.txt2}
          </a>
          <a
            href="https://me.csdn.net/weixin_44839084"
            target="_blank"
            rel="noopener noreferrer"
            className="text"
          >
            {footer.resource.txt3}
          </a>
          <a
            href="https://github.com/milvus-io/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
            className="text"
          >
            {footer.resource.txt4}
          </a>
        </ul>
        <ul>
          <li className="title">{footer.contact.title}</li>
          <li className="contact-items">
            <a
              className="slack"
              target="_blank"
              rel="noopener noreferrer"
              href={`https://join.slack.com/t/milvusio/shared_invite/enQtNzY1OTQ0NDI3NjMzLWNmYmM1NmNjOTQ5MGI5NDhhYmRhMGU5M2NhNzhhMDMzY2MzNDdlYjM5ODQ5MmE3ODFlYzU3YjJkNmVlNDQ2ZTk`}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 256 256"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid"
              >
                <g
                  id="Page-1"
                  stroke="none"
                  strokeWidth="1"
                  fill="none"
                  fillRule="evenodd"
                >
                  <g id="slack-brands" fill="#FFFFFF" fillRule="nonzero">
                    <path
                      d="M53.7828571,161.771429 C53.7828571,176.571429 41.6914286,188.662857 26.8914286,188.662857 C12.0914286,188.662857 0,176.571429 0,161.771429 C0,146.971429 12.0914286,134.88 26.8914286,134.88 L53.7828571,134.88 L53.7828571,161.771429 Z M67.3371429,161.771429 C67.3371429,146.971429 79.4285714,134.88 94.2285714,134.88 C109.028571,134.88 121.12,146.971429 121.12,161.771429 L121.12,229.108571 C121.12,243.908571 109.028571,256 94.2285714,256 C79.4285714,256 67.3371429,243.908571 67.3371429,229.108571 L67.3371429,161.771429 Z M94.2285714,53.7828571 C79.4285714,53.7828571 67.3371429,41.6914286 67.3371429,26.8914286 C67.3371429,12.0914286 79.4285714,0 94.2285714,0 C109.028571,0 121.12,12.0914286 121.12,26.8914286 L121.12,53.7828571 L94.2285714,53.7828571 L94.2285714,53.7828571 Z M94.2285714,67.3371429 C109.028571,67.3371429 121.12,79.4285714 121.12,94.2285714 C121.12,109.028571 109.028571,121.12 94.2285714,121.12 L26.8914286,121.12 C12.0914286,121.12 0,109.028571 0,94.2285714 C0,79.4285714 12.0914286,67.3371429 26.8914286,67.3371429 L94.2285714,67.3371429 L94.2285714,67.3371429 Z M202.217143,94.2285714 C202.217143,79.4285714 214.308571,67.3371429 229.108571,67.3371429 C243.908571,67.3371429 256,79.4285714 256,94.2285714 C256,109.028571 243.908571,121.12 229.108571,121.12 L202.217143,121.12 L202.217143,94.2285714 L202.217143,94.2285714 Z M188.662857,94.2285714 C188.662857,109.028571 176.571429,121.12 161.771429,121.12 C146.971429,121.12 134.88,109.028571 134.88,94.2285714 L134.88,26.8914286 C134.88,12.0914286 146.971429,0 161.771429,0 C176.571429,0 188.662857,12.0914286 188.662857,26.8914286 L188.662857,94.2285714 Z M161.771429,202.217143 C176.571429,202.217143 188.662857,214.308571 188.662857,229.108571 C188.662857,243.908571 176.571429,256 161.771429,256 C146.971429,256 134.88,243.908571 134.88,229.108571 L134.88,202.217143 L161.771429,202.217143 Z M161.771429,188.662857 C146.971429,188.662857 134.88,176.571429 134.88,161.771429 C134.88,146.971429 146.971429,134.88 161.771429,134.88 L229.108571,134.88 C243.908571,134.88 256,146.971429 256,161.771429 C256,176.571429 243.908571,188.662857 229.108571,188.662857 L161.771429,188.662857 Z"
                      id="Shape"
                    ></path>
                  </g>
                </g>
              </svg>
              <span>Slack</span>
            </a>
          </li>
          <li className="contact-items">
            <a
              className="twitter"
              target="_blank"
              rel="noopener noreferrer"
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
              <span>Twitter</span>
            </a>
          </li>

          <li className="contact-items">
            <a
              className="facebook"
              target="_blank"
              rel="noopener noreferrer"
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
              <span>Facebook</span>
            </a>
          </li>

          <li className="contact-items wechat">
            <a href="#">
              <svg
                fill="#EEE"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M21.502 19.525c1.524-1.105 2.498-2.738 2.498-4.554 0-3.326-3.237-6.023-7.229-6.023s-7.229 2.697-7.229 6.023c0 3.327 3.237 6.024 7.229 6.024.825 0 1.621-.117 2.36-.33l.212-.032c.139 0 .265.043.384.111l1.583.914.139.045c.133 0 .241-.108.241-.241l-.039-.176-.326-1.215-.025-.154c0-.162.08-.305.202-.392zm-12.827-17.228c-4.791 0-8.675 3.236-8.675 7.229 0 2.178 1.168 4.139 2.997 5.464.147.104.243.276.243.471l-.03.184-.391 1.458-.047.211c0 .16.13.29.289.29l.168-.054 1.899-1.097c.142-.082.293-.133.46-.133l.255.038c.886.255 1.842.397 2.832.397l.476-.012c-.188-.564-.291-1.158-.291-1.771 0-3.641 3.542-6.593 7.911-6.593l.471.012c-.653-3.453-4.24-6.094-8.567-6.094zm5.686 11.711c-.532 0-.963-.432-.963-.964 0-.533.431-.964.963-.964.533 0 .964.431.964.964 0 .532-.431.964-.964.964zm4.82 0c-.533 0-.964-.432-.964-.964 0-.533.431-.964.964-.964.532 0 .963.431.963.964 0 .532-.431.964-.963.964zm-13.398-5.639c-.639 0-1.156-.518-1.156-1.156 0-.639.517-1.157 1.156-1.157.639 0 1.157.518 1.157 1.157 0 .638-.518 1.156-1.157 1.156zm5.783 0c-.639 0-1.156-.518-1.156-1.156 0-.639.517-1.157 1.156-1.157.639 0 1.157.518 1.157 1.157 0 .638-.518 1.156-1.157 1.156z" />
              </svg>
              <span>{footer.contact.wechat}</span>
            </a>
            <div className="wechatqr">
              <img
                style={{ maxWidth: "initial" }}
                width="150"
                height="150"
                src={MilvusUserWechat}
                alt="二维码"
              />
              <img
                style={{ maxWidth: "initial" }}
                width="150"
                height="150"
                src={Qcode}
                alt="二维码"
              />

            </div>

          </li>
        </ul>
      </div>

      <div className="copy-right">© {new Date().getFullYear()} ZILLIZ</div>
    </footer>
  )
}

Footer.propTypes = {
  language: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired,
}

export default Footer
