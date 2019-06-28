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
                <p className="lead text-secondary">A Distributed High Performance Vector Database System</p>
                <p className="mt-5"><a href={this.docUrl('QuickStart', language)} className="btn btn-primary">Get Started</a></p>
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
                <h1>What is Vector Database</h1>
                <p className="lead">Feature vector, the fundamental abstraction of concerned objects in the realm of AI/ML.</p>

                <div className="row mt-5">
                  <div className="col-12 col-sm-6">
                    <h3><strong>What is Vector</strong></h3>
                    <p className="lead">A vector is a series of numbers. It is like a matrix with only one row but multiple columns (or only one column but multiple rows), for example [2,0,1,9,0,6,3,0].</p>
                    <a href="/whatIsVecDb">Read More</a>
                  </div>

                  <div className="col-12 col-sm-6 pt-3 pt-sm-0">
                    <h3><strong>Vector Database</strong></h3>
                    <p className="lead">By efficiently storing and indexing the feature vectors, Milvus could help to optimize the vector matching performance in a large scale.</p>
                    <a href="/whatIsVecDb">Read More</a>
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
                <h1>Milvus Features</h1>
              </div>
            </div>
            <div className="row text-left mt-5">
              <div className="col-12 col-md-4">
                <div className="row">
                  <div className="col-3 paddingTop10">
                    <img alt="f1" className="fdb-icon" src={`${baseUrl}images/icons/gift.svg`} />
                  </div>
                  <div className="col-9">
                    <h3><strong>Smart Index</strong></h3>
                    <p>Milvus provids different types of indexes, including optimized quantization index, tree and graph index and etc. User could choose proper index for different kinds of vector spaces. </p>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-4 pt-3 pt-sm-4 pt-md-0">
                <div className="row">
                  <div className="col-3 paddingTop10">
                    <img alt="f2" className="fdb-icon" src={`${baseUrl}images/icons/cloud.svg`} />
                  </div>
                  <div className="col-9">
                    <h3><strong>High Availability</strong></h3>
                    <p>The distributed cluster architecture provides continuous service capability while some of the nodes fail.</p>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-4 pt-3 pt-sm-4 pt-md-0">
                <div className="row">
                  <div className="col-3 paddingTop10">
                    <img alt="f3" className="fdb-icon" src={`${baseUrl}images/icons/map-pin.svg`} />
                  </div>
                  <div className="col-9">
                    <h3><strong>High Elasticity</strong></h3>
                    <p>The disaggregated storage and compute architecture provides better flexibility.</p>
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
                    <h3><strong>High Performance</strong></h3>
                    <p>Accelerate the indexing speed by the heterogeneous computing architecture.</p>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-4 pt-3 pt-sm-4 pt-md-0">
                <div className="row">
                  <div className="col-3 paddingTop10">
                    <img alt="f5" className="fdb-icon" src={`${baseUrl}images/icons/layout.svg`} />
                  </div>
                  <div className="col-9">
                    <h3><strong>Fully Compatibility</strong></h3>
                    <p>Milvus is compatible with major AI/ML framework and programming language.</p>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-4 pt-3 pt-sm-4 pt-md-0">
                <div className="row">
                  <div className="col-3 paddingTop10">
                    <img alt="f6" className="fdb-icon" src={`${baseUrl}images/icons/layout.svg`} />
                  </div>
                  <div className="col-9">
                    <h3><strong>Lower Cost</strong></h3>
                    <p>Maximize the computing power of a cluster by employing GPU.</p>
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
                <h1>Milvus Architecture</h1>
                <p className="lead">Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life One day however a small line of blind text by the name of Lorem Ipsum decided to leave for the far World of Grammar.</p>
                <p className="mt-4"><a href={this.docUrl('UserGuide/#system-architecture', language)} className="btn btn-secondary">Learn More about Milvus Architecture</a></p>
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
                <h1>Vector Search Database Comparison</h1>
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
                  <th scope="row" className="border-0">Hobby2</th>
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
                  <th scope="row">Support</th>
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
                  <th scope="row" >Full source code</th>
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
                  <th scope="row">SaaS / Subscription</th>
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
                  <th scope="row">Intranet</th>
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
                  <th scope="row">Downloadable Software</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                </tr>
                <tr>
                  <th scope="row">Redistribute</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                </tr>
                <tr>
                  <th scope="row">Custom code</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                </tr>
                <tr>
                  <th scope="row">Custom code</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                </tr>
                <tr>
                  <th scope="row">Custom code</th>
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
