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
              <div className="col-12 col-md-12">
                {/* <img alt="logo" className="fdb-icon" src={`${baseUrl}images/icons/coffee.svg`} /> */}
                <h1 className="text-primary">Milvus</h1>
                <p className="lead text-secondary">An intelligent feature vector indexing database that allows you to access data at unparalleled speed.</p>
                <p className="mt-5"><a href={this.docUrl('userguide/getting-started', language)} className="btn btn-primary">Why Milvus</a></p>
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
                <h1>What is Milvus</h1>
                <p className="lead">
                Designed by ZILLIZ, Milvus is a distributed GPU database for massive feature vector analytics. Built on GPU/CPU heterogeneous computing architecture, multibillion row datasets can now be queried in seconds, at massively reduced cost. 
                <br /><a href={this.docUrl('WhitePaper', language)}>Read More</a>
                </p>
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
                    <img alt="f1" className="fdb-icon" src={`${baseUrl}images/icons/layout.svg`} />
                  </div>
                  <div className="col-9">
                    <h3><strong>Wonderful Performance</strong></h3>
                    <p>Built on CPU/GPU heterogeneous computing architecture, the data processing speed is more than 1000 times faster than traditional database.</p>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-4 pt-3 pt-sm-4 pt-md-0">
                <div className="row">
                  <div className="col-3 paddingTop10">
                    <img alt="f2" className="fdb-icon" src={`${baseUrl}images/icons/layers.svg`} />
                  </div>
                  <div className="col-9">
                    <h3><strong>Intelligent Index</strong></h3>
                    <p>With optimized quantization index, tree and graph index, etc., you can choose the proper index to easily adapt to your businesses.</p>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-4 pt-3 pt-sm-4 pt-md-0">
                <div className="row">
                  <div className="col-3 paddingTop10">
                    <img alt="f3" className="fdb-icon" src={`${baseUrl}images/icons/map.svg`} />
                  </div>
                  <div className="col-9">
                    <h3><strong>High Elasticity</strong></h3>
                    <p>Change the computing and storage nodes as your business expands,  The disaggregated storage and compute architecture allow you to flexibility change the computing and storage nodes as the business expands. </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="row text-left pt-3 pt-sm-4 pt-md-5">
              <div className="col-12 col-md-4">
                <div className="row">
                  <div className="col-3 paddingTop10">
                    <img alt="f4" className="fdb-icon" src={`${baseUrl}images/icons/cloud.svg`} />
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
                    <img alt="f5" className="fdb-icon" src={`${baseUrl}images/icons/package.svg`} />
                  </div>
                  <div className="col-9">
                    <h3><strong>Easy Integration</strong></h3>
                    <p>Compatible with major AI/ML framework and programming language.</p>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-4 pt-3 pt-sm-4 pt-md-0">
                <div className="row">
                  <div className="col-3 paddingTop10">
                    <img alt="f6" className="fdb-icon" src={`${baseUrl}images/icons/monitor.svg`} />
                  </div>
                  <div className="col-9">
                    <h3><strong>Easy to use</strong></h3>
                    <p>With Python/C++ based client SDK as well as visualized GUI monitoring dashboard, Milvus ensures you have outstanding ease of use.</p>
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
                <tr>
                  <th scope="row" className="border-0">CPU/GPU heterogeneous computing capability</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                </tr>
                <tr>
                  <th scope="row">Quantization index</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                </tr>
                <tr>
                  <th scope="row" >Hash index</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                </tr>
                <tr>
                  <th scope="row">Graph index</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                </tr>
                <tr>
                  <th scope="row">High availability</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                </tr>
                <tr>
                  <th scope="row">Distributed architecture</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                </tr>
                <tr>
                  <th scope="row">Easy-to-use user interface</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                </tr>
                <tr>
                  <th scope="row">GUI monitoring dashboard</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                </tr>
                <tr>
                  <th scope="row">Simple deployment</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                </tr>
                <tr>
                  <th scope="row">C++/Python SDK</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                </tr>
                <tr>
                  <th scope="row">RESTful API	</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                </tr>
                <tr>
                  <th scope="row">Enterprise user support</th>
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
                    <h2 className="font-weight-light">Milvus</h2>
                  </td>
                </tr>
                <tr>
                  <th scope="row">CPU/GPU heterogeneous computing capability</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                </tr>
                <tr>
                  <th scope="row">Quantization index</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                </tr>
                <tr>
                  <th scope="row">Hash index</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                </tr>
                <tr>
                  <th scope="row">Graph index</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                </tr>
                <tr>
                  <th scope="row">High availability</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                </tr>
                <tr>
                  <th scope="row">Distributed architecture</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                </tr>
                <tr>
                  <th scope="row">Easy-to-use user interface</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                </tr>
                <tr>
                  <th scope="row">GUI monitoring dashboard</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                </tr>
                <tr>
                  <th scope="row">Simple deployment</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                </tr>
                <tr>
                  <th scope="row">C++/Python SDK</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                </tr>
                <tr>
                  <th scope="row">RESTful API</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                </tr>
                <tr>
                  <th scope="row">Enterprise user support</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                </tr>
              </tbody>
            </table>

            <table className="table text-center mt-5 d-table d-lg-none">
              <tbody>
                <tr>
                  <td className="text-center" colSpan="2">
                    <h2 className="font-weight-light">FAISS</h2>
                  </td>
                </tr>
                <tr>
                  <th scope="row">CPU/GPU heterogeneous computing capability</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                </tr>
                <tr>
                  <th scope="row">Quantization index</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                </tr>
                <tr>
                  <th scope="row">Hash index</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                </tr>
                <tr>
                  <th scope="row">Graph index</th>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                </tr>
                <tr>
                  <th scope="row">High availability</th>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                </tr>
                <tr>
                  <th scope="row">Distributed architecture</th>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                </tr>
                <tr>
                  <th scope="row">Easy-to-use user interface</th>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                </tr>
                <tr>
                  <th scope="row">GUI monitoring dashboard</th>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                </tr>
                <tr>
                  <th scope="row">Simple deployment</th>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                </tr>
                <tr>
                  <th scope="row">C++/Python SDK</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                </tr>
                <tr>
                  <th scope="row">RESTful API</th>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                </tr>
                <tr>
                  <th scope="row">Enterprise user support</th>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                </tr>
              </tbody>
            </table>

            <table className="table text-center mt-5 d-table d-lg-none">
            <tbody>
                <tr>
                  <td className="text-center" colSpan="2">
                    <h2 className="font-weight-light">SPTAG</h2>
                  </td>
                </tr>
                <tr>
                  <th scope="row">CPU/GPU heterogeneous computing capability</th>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                </tr>
                <tr>
                  <th scope="row">Quantization index</th>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                </tr>
                <tr>
                  <th scope="row">Hash index</th>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                </tr>
                <tr>
                  <th scope="row">Graph index</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                </tr>
                <tr>
                  <th scope="row">High availability</th>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                </tr>
                <tr>
                  <th scope="row">Distributed architecture</th>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                </tr>
                <tr>
                  <th scope="row">Easy-to-use user interface</th>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                </tr>
                <tr>
                  <th scope="row">GUI monitoring dashboard</th>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                </tr>
                <tr>
                  <th scope="row">Simple deployment</th>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                </tr>
                <tr>
                  <th scope="row">C++/Python SDK</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                </tr>
                <tr>
                  <th scope="row">RESTful API</th>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                </tr>
                <tr>
                  <th scope="row">Enterprise user support</th>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                </tr>
              </tbody>
            </table>
    
          </div>
        </section>
      )
    }

    return (
      <div className="page">
        <CallToAction />
        <WhatIsVecDb />
        <Features />
        {/* <TechAndArch /> */}
        <Comparison />
      </div>
    );
  }
}

module.exports = Index;
