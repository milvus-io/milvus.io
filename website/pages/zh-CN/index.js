/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
class Index extends React.Component {
  docUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    const docsUrl = this.props.config.docsUrl;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    return `${baseUrl}${docsPart}${langPart}${doc}`;
  }

  render() {
    const { config: siteConfig, language = '' } = this.props;
    const { baseUrl } = siteConfig;

    const CallToAction = () => {
      return (
        <section className="fdb-block fdb-viewport splash-container" style={{ }}>
          <div className="container justify-content-center align-items-center d-flex splash-container">
            <div className="row justify-content-center text-center splash-content">
              <div className="col-12 col-md-8">
                <img alt="logo" className="fdb-icon" src={`${baseUrl}images/icons/coffee.svg`} />
                <h1 className="text-primary">Milvus</h1>
                <p className="lead text-secondary">高性能，可弹性伸缩的特征向量数据库系统</p>
                <p className="mt-5"><a href={this.docUrl('QuickStart', language)} className="btn btn-primary">快速开始</a></p>
              </div>
            </div>
          </div>
        </section>
      )
    }

    const WhatIsVecDb = () => {
      return (
        <section className="fdb-block">
          <div className="container">
            <div className="row text-left align-items-center">
              <div className="col-10 col-sm-6 m-auto m-lg-0 col-lg-4">
                <img alt="splash" className="img-fluid" src={`${baseUrl}images/draws/opened.svg`} />
              </div>

              <div className="col-12 col-lg-7 offset-lg-1 pt-4 pt-lg-0">
                <h1>什么是向量数据库</h1>
                <div className="row mt-5">
                  <div className="col-12 col-sm-6">
                    <h3><strong>什么是向量</strong></h3>
                    <p className="lead">现实世界的事物，复杂而多元，通常是很难使用少数几个简单数能精确描述的。因此，我们会使用特征向量来精确描述一个事物，特征向量就是现实事物的数学抽象。</p>
                    <a href="/whatIsVecDb">点击详情</a>
                  </div>

                  <div className="col-12 col-sm-6 pt-3 pt-sm-0">
                    <h3><strong>特征向量检索数据库</strong></h3>
                    <p className="lead">随着机器学习和深度学习技术越来越成熟，应用越来越广泛，随之而产生的特征向量数据也会越来越庞大，但目前看来，传统的数据库系统和大数据系统并不能满足海量特征向量检索的要求。</p>
                    <a href="/whatIsVecDb">点击详情</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )
    }

    const Features = () => {
      return (
        <section className="fdb-block">
          <div className="container">
            <div className="row text-center">
              <div className="col-12">
                <h1>Milvus 特性</h1>
              </div>
            </div>
            <div className="row text-left mt-5">
              <div className="col-12 col-md-4">
                <div className="row">
                  <div className="col-3 paddingTop10">
                    <img alt="f1" className="fdb-icon" src={`${baseUrl}images/icons/gift.svg`} />
                  </div>
                  <div className="col-9">
                    <h3><strong>高速智能向量检索</strong></h3>
                    <p>使用CPU/GPU异构计算引擎，提供高准确度的百亿向量检索，检索结果的秒级响应。</p>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-4 pt-3 pt-sm-4 pt-md-0">
                <div className="row">
                  <div className="col-3 paddingTop10">
                    <img alt="f2" className="fdb-icon" src={`${baseUrl}images/icons/cloud.svg`} />
                  </div>
                  <div className="col-9">
                    <h3><strong>水平线性弹性扩展</strong></h3>
                    <p>可随着业务增长而伸缩，只需要通过增加更多的机器来满足业务增长需要。</p>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-4 pt-3 pt-sm-4 pt-md-0">
                <div className="row">
                  <div className="col-3 paddingTop10">
                    <img alt="f3" className="fdb-icon" src={`${baseUrl}images/icons/map-pin.svg`} />
                  </div>
                  <div className="col-9">
                    <h3><strong>高可用</strong></h3>
                    <p>内部计算、存储和元数据集群，均允许部分实例失效，而不影响整个集群的可用性。　</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="row text-left pt-3 pt-sm-4 pt-md-5">
              <div className="col-12 col-md-4">
                <div className="row">
                  <div className="col-3 paddingTop10">
                    <img alt="f4" className="fdb-icon" src={`${baseUrl}images/icons/life-buoy.svg`} />
                  </div>
                  <div className="col-9">
                    <h3><strong>高易用性</strong></h3>
                    <p>提供了基于C++/Python的客户端SDK。对于其他类型的语言，Milvus支持通过RESTful和RPC的访问方法。</p>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-4 pt-3 pt-sm-4 pt-md-0">
                <div className="row">
                  <div className="col-3 paddingTop10">
                    <img alt="f5" className="fdb-icon" src={`${baseUrl}images/icons/layout.svg`} />
                  </div>
                  <div className="col-9">
                    <h3><strong>AI模型全支持</strong></h3>
                    <p>支持目前所有AI训练框架所训练的模型所产生的特征向量，涵盖图片、视频、文本、语音等等方面。</p>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-4 pt-3 pt-sm-4 pt-md-0">
                <div className="row">
                  <div className="col-3 paddingTop10">
                    <img alt="f6" className="fdb-icon" src={`${baseUrl}images/icons/layout.svg`} />
                  </div>
                  <div className="col-9">
                    <h3><strong>跨平台</strong></h3>
                    <p>可以运行在Linux和Windows平台上，支持x86/ARM/PowerPC等架构，为边缘计算应用提供基础支撑。</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )
    }

    const TechAndArch = () => {
      return (
        <section className="fdb-block">
          <div className="container align-items-center justify-content-center d-flex">
            <div className="row align-items-center text-left">
              <div className="col-12 col-sm-6">
                <img alt="splash" width="440" className="img-fluid" src={`${baseUrl}img/megasearch_arch.svg`} />
              </div>

              <div className="col-12 col-lg-5 ml-auto pt-5 pt-lg-0">
                <h1>Milvus 架构</h1>
                <p className="lead">Milvus系统由四部分组成：Milvus Server，Storage Cluster，Meta Management，Milvus Monitoring</p>
                <p className="mt-4"><a href={this.docUrl('UserGuide/#system-architecture', language)} className="btn btn-secondary">点击查看详细Milvus架构信息</a></p>
              </div>
            </div>
          </div>
        </section>
      )
    }

    const Comparison = () => {
      return (
        <section className="fdb-block">
          <div className="container">
            <div className="row text-center">
              <div className="col">
                <h1>向量检索工具对比</h1>
              </div>
            </div>
            <table className="table text-center mt-5 d-none d-lg-table">
              <tbody>
                <tr>
                  <th scope="row" className="border-0"></th>
                  <td className="text-center border-0">
                    <h2 className="font-weight-light">Milvus</h2>
                  </td>
                  <td className="text-center border-0">
                    <h2 className="font-weight-light">FAISS</h2>
                  </td>
                  <td className="text-center border-0">
                    <h2 className="font-weight-light">SPTAG</h2>
                  </td>
                </tr>
                <tr className='Hobby2'>
                  <th scope="row" className="border-0">CPU/GPU异构计算能力</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                </tr>
                <tr className='content' style={{ display: 'none' }} >
                  <td colSpan='5'>
                    <ul>
                      <li>CDN-providing hosts like <a href="https://www.netlify.com" target="_blank">Netlify</a> support sites built on Gatsby and other static frameworks</li>
                      <li>WordPress allows this through <a href="https://wordpress.org/plugins/cdn-enabler/" target="_blank">plugins</a>.</li>
                      <li>Site builders like Squarespace usually come with a CDN out of the box.</li>
                    </ul>
                  </td>
                </tr>
                <tr>
                  <th scope="row">量化索引</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                </tr>
                <tr className='content' style={{ display: 'none' }} >
                  <td colSpan='5'>
                    <ul>
                      <li>CDN-providing hosts like <a href="https://www.netlify.com" target="_blank">Netlify</a> support sites built on Gatsby and other static frameworks</li>
                      <li>WordPress allows this through <a href="https://wordpress.org/plugins/cdn-enabler/" target="_blank">plugins</a>.</li>
                      <li>Site builders like Squarespace usually come with a CDN out of the box.</li>
                    </ul>
                  </td>
                </tr>
                <tr>
                  <th scope="row" >哈希索引</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                </tr>
                <tr className='content' style={{ display: 'none' }} >
                  <td colSpan='5'>
                    <ul>
                      <li>CDN-providing hosts like <a href="https://www.netlify.com" target="_blank">Netlify</a> support sites built on Gatsby and other static frameworks</li>
                      <li>WordPress allows this through <a href="https://wordpress.org/plugins/cdn-enabler/" target="_blank">plugins</a>.</li>
                      <li>Site builders like Squarespace usually come with a CDN out of the box.</li>
                    </ul>
                  </td>
                </tr>
                <tr>
                  <th scope="row">图索引</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                </tr>
                <tr className='content' style={{ display: 'none' }} >
                  <td colSpan='5'>
                    <span>Can you build your site as 'static' files which can be deployed without a server, cached on CDN distributed throughout the globe?
                    </span>
                  </td>
                </tr>
                <tr>
                  <th scope="row">高可用设计</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                </tr>
                <tr className='content' style={{ display: 'none' }} >
                  <td className='content' colSpan='5'>
                    <ul>
                      <li>CDN-providing hosts like <a href="https://www.netlify.com" target="_blank">Netlify</a> support sites built on Gatsby and other static frameworks</li>
                      <li>WordPress allows this through <a href="https://wordpress.org/plugins/cdn-enabler/" target="_blank">plugins</a>.</li>
                      <li>Site builders like Squarespace usually come with a CDN out of the box.</li>
                    </ul>
                  </td>
                </tr>
                <tr>
                  <th scope="row">分布式架构</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                </tr>
                <tr>
                  <th scope="row">易用标准化用户接口</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                </tr>
                <tr>
                  <th scope="row">图形化监控工具</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                </tr>
                <tr>
                  <th scope="row">企业级用户支持</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                </tr>
                <tr>
                  <th scope="row">灵活的商业模式</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                </tr>
              </tbody>
            </table>
            <table className="table text-center mt-5 d-table d-lg-none">
              <tbody>
                <tr>
                  <td className="text-center border-0" colSpan="2">
                    <h2 className="font-weight-light">Hobby</h2>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Support</th>
                  <td>3 months</td>
                </tr>
                <tr>
                  <th scope="row">Full source code</th>
                  <td>✓</td>
                </tr>
                <tr>
                  <th scope="row">SaaS / Subscription</th>
                  <td>✓</td>
                </tr>
                <tr>
                  <th scope="row">Intranet</th>
                  <td></td>
                </tr>
                <tr>
                  <th scope="row">Downloadable Software</th>
                  <td></td>
                </tr>
                <tr>
                  <th scope="row">Redistribute</th>
                  <td></td>
                </tr>
                <tr>
                  <th scope="row">Custom code</th>
                  <td></td>
                </tr>
              </tbody>
            </table>

            <table className="table text-center mt-5 d-table d-lg-none">
              <tbody>
                <tr>
                  <td className="text-center" colSpan="2">
                    <h2 className="font-weight-light">Professional</h2>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Support</th>
                  <td>6 months</td>
                </tr>
                <tr>
                  <th scope="row">Full source code</th>
                  <td>✓</td>
                </tr>
                <tr>
                  <th scope="row">SaaS / Subscription</th>
                  <td>✓</td>
                </tr>
                <tr>
                  <th scope="row">Intranet</th>
                  <td>✓</td>
                </tr>
                <tr>
                  <th scope="row">Downloadable Software</th>
                  <td></td>
                </tr>
                <tr>
                  <th scope="row">Redistribute</th>
                  <td></td>
                </tr>
                <tr>
                  <th scope="row">Custom code</th>
                  <td></td>
                </tr>
              </tbody>
            </table>

            <table className="table text-center mt-5 d-table d-lg-none">
              <tbody>
                <tr>
                  <td className="text-center" colSpan="2">
                    <h2 className="font-weight-light">Business</h2>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Support</th>
                  <td>12 months</td>
                </tr>
                <tr>
                  <th scope="row">Full source code</th>
                  <td>✓</td>
                </tr>
                <tr>
                  <th scope="row">SaaS / Subscription</th>
                  <td>✓</td>
                </tr>
                <tr>
                  <th scope="row">Intranet</th>
                  <td>✓</td>
                </tr>
                <tr>
                  <th scope="row">Downloadable Software</th>
                  <td>✓</td>
                </tr>
                <tr>
                  <th scope="row">Redistribute</th>
                  <td></td>
                </tr>
                <tr>
                  <th scope="row">Custom code</th>
                  <td></td>
                </tr>
              </tbody>
            </table>

            <table className="table text-center mt-5 d-table d-lg-none">
              <tbody>
                <tr>
                  <td className="text-center" colSpan="2">
                    <h2 className="font-weight-light">Enterprise</h2>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Support</th>
                  <td>Custom</td>
                </tr>
                <tr>
                  <th scope="row">Full source code</th>
                  <td>✓</td>
                </tr>
                <tr>
                  <th scope="row">SaaS / Subscription</th>
                  <td>✓</td>
                </tr>
                <tr>
                  <th scope="row">Intranet</th>
                  <td>✓</td>
                </tr>
                <tr>
                  <th scope="row">Downloadable Software</th>
                  <td>✓</td>
                </tr>
                <tr>
                  <th scope="row">Redistribute</th>
                  <td>✓</td>
                </tr>
                <tr>
                  <th scope="row">Custom code</th>
                  <td>✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      )
    }

    return (
      <div>
        <CallToAction />
        <WhatIsVecDb />
        <Features />
        <TechAndArch />
        <Comparison />
      </div>
    );
  }
}

module.exports = Index;
