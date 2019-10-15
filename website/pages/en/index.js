/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require("react");
class Index extends React.Component {
  docUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    const docsUrl = this.props.config.docsUrl;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ""}`;
    const langPart = `${language ? `${language}/` : ""}`;
    return `${baseUrl}${docsPart}${langPart}${doc}`;
  }

  render() {
    const { config: siteConfig, language = "" } = this.props;
    const { baseUrl } = siteConfig;

    const CallToAction = () => {
      return (
        <section className="fdb-block fdb-viewport splash-container">
          <div className="container justify-content-center align-items-center d-flex ">
            <div className="row splash-content">
              <div className="col-12 col-md-12">
                {/* <img alt="logo" className="fdb-icon" src={`${baseUrl}images/icons/coffee.svg`} /> */}
                <p className="lead text-secondary">
                  An intelligent vector database that allows you to access data
                  at unparalleled speed.
                </p>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <p className="main-button">
                    <a
                      href={this.docUrl("aboutmilvus/overview", language)}
                      className="milvus-btn"
                    >
                      Why Milvus
                    </a>
                  </p>
                  <div className="githubicon">
                    <a
                      class="github-button"
                      href="https://github.com/milvus-io/milvus"
                      data-color-scheme="no-preference: dark; light: light; dark: dark;"
                      data-size="large"
                      data-show-count="true"
                      aria-label="Star milvus-io/milvus on GitHub"
                    >
                      Star
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    };

    const WhatIsVecDb = () => {
      return (
        <section className="fdb-block">
          <div className="container">
            <div className="row text-left align-items-center">
              <div className="col-10 col-sm-6 m-auto m-lg-0 col-lg-4">
                <img
                  alt="splash"
                  className="img-fluid"
                  src={`${baseUrl}new-images/what-is-milvus.png`}
                />
              </div>

              <div className="col-12 col-lg-7 offset-lg-1 pt-4 pt-lg-0">
                <h1>What is Milvus</h1>
                <p className="lead">
                  Designed by ZILLIZ, Milvus is a distributed GPU database for
                  large scale feature vector analysis. Built on GPU/CPU
                  heterogeneous computing architecture, multibillion row
                  datasets can now be queried in seconds, at massively reduced
                  cost.
                  <br />
                  <a
                    class="milvus-btn"
                    href={this.docUrl("aboutmilvus/overview", language)}
                  >
                    Read More
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>
      );
    };

    const Features = () => {
      return (
        <section className="fdb-block margin-top-zero">
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
                    <img
                      alt="Outstanding Performance"
                      className="fdb-icon"
                      src={`${baseUrl}new-images/icon-1.png`}
                    />
                  </div>
                  <div className="col-9">
                    <h3>
                      <strong>Outstanding Performance</strong>
                    </h3>
                    <p>
                      Built on CPU/GPU heterogeneous computing architecture, the
                      data processing speed is more than 1000 times faster than
                      traditional database.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-4 pt-3 pt-sm-4 pt-md-0">
                <div className="row">
                  <div className="col-3 paddingTop10">
                    <img
                      alt="Intelligent Index"
                      className="fdb-icon"
                      src={`${baseUrl}new-images/icon-2.png`}
                    />
                  </div>
                  <div className="col-9">
                    <h3>
                      <strong>Intelligent Index</strong>
                    </h3>
                    <p>
                      Depending on your business needs, you can choose from our
                      various and optimized data index types, designed based on
                      quantitization, tree-based and graph methods, etc.{" "}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-4 pt-3 pt-sm-4 pt-md-0">
                <div className="row">
                  <div className="col-3 paddingTop10">
                    <img
                      alt="Strong Scalability"
                      className="fdb-icon"
                      src={`${baseUrl}new-images/icon-3.png`}
                    />
                  </div>
                  <div className="col-9">
                    <h3>
                      <strong>Strong Scalability</strong>
                    </h3>
                    <p>
                      The disaggregated storage and compute architecture allow
                      you to flexibly adapt the computing and storage types as
                      your business expands.{" "}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="row text-left pt-3 pt-sm-4 pt-md-5">
              <div className="col-12 col-md-4">
                <div className="row">
                  <div className="col-3 paddingTop10">
                    <img
                      alt="High Availability"
                      className="fdb-icon"
                      src={`${baseUrl}new-images/icon-4.png`}
                    />
                  </div>
                  <div className="col-9">
                    <h3>
                      <strong>High Availability</strong>
                    </h3>
                    <p>
                      The distributed cluster architecture provides continued
                      service when some of the system components fail.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-4 pt-3 pt-sm-4 pt-md-0">
                <div className="row">
                  <div className="col-3 paddingTop10">
                    <img
                      alt="High Availability"
                      className="fdb-icon"
                      src={`${baseUrl}new-images/icon-5.png`}
                    />
                  </div>
                  <div className="col-9">
                    <h3>
                      <strong>High Compatibility</strong>
                    </h3>
                    <p>
                      Compatible with major AI/ML models and programming
                      languages.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-4 pt-3 pt-sm-4 pt-md-0">
                <div className="row">
                  <div className="col-3 paddingTop10">
                    <img
                      alt="Easy to use"
                      className="fdb-icon"
                      src={`${baseUrl}new-images/icon-6.png`}
                    />
                  </div>
                  <div className="col-9">
                    <h3>
                      <strong>Easy to use</strong>
                    </h3>
                    <p>
                      With Python/C++ based client SDK as well as visualized GUI
                      monitoring dashboard, Milvus ensures you have outstanding
                      ease of use.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    };

    const TechAndArch = () => {
      return (
        <section className="fdb-block">
          <div className="container align-items-center justify-content-center d-flex">
            <div className="row align-items-center text-left">
              <div className="col-12 col-sm-6">
                <img
                  alt="splash"
                  width="440"
                  className="img-fluid"
                  src={`${baseUrl}img/megasearch_arch.svg`}
                />
              </div>

              <div className="col-12 col-lg-5 ml-auto pt-5 pt-lg-0">
                <h1>Milvus Architecture</h1>
                <p className="lead">
                  Even the all-powerful Pointing has no control about the blind
                  texts it is an almost unorthographic life One day however a
                  small line of blind text by the name of Lorem Ipsum decided to
                  leave for the far World of Grammar.
                </p>
                <p className="mt-4">
                  <a
                    href={this.docUrl(
                      "UserGuide/#system-architecture",
                      language
                    )}
                    className="btn btn-secondary"
                  >
                    Learn More about Milvus Architecture
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>
      );
    };

    const Comparison = () => {
      return (
        <section className="fdb-block margin-top-zero">
          <div className="container">
            <div className="row text-center">
              <div className="col">
                <h1>Vector Search Database Comparison</h1>
              </div>
            </div>
            <table className="table text-center mt-5 d-none d-lg-table">
              <tbody>
                <tr>
                  <th scope="row" className="border-0 tb-hd"></th>
                  <td className="text-center border-0 tb-hd">
                    <h2 className="font-weight-light">Milvus</h2>
                  </td>
                  <td className="text-center border-0 tb-hd">
                    <h2 className="font-weight-light">FAISS</h2>
                  </td>
                  <td className="text-center border-0 tb-hd">
                    <h2 className="font-weight-light">SPTAG</h2>
                  </td>
                </tr>
                <tr>
                  <th scope="row" className="border-0">
                    CPU/GPU heterogeneous computing capability
                  </th>
                  <td className="css-7sa0gy">
                    <div className="css-full"></div>
                  </td>
                  <td className="css-7sa0gy">
                    <div className="css-full"></div>
                  </td>
                  <td className="css-7sa0gy">
                    <div className="css-zero"></div>
                  </td>
                </tr>
                <tr className="content" style={{ display: "none" }}>
                  <td colSpan="5">
                    <span>
                      I am CPU/GPU heterogeneous computing capability content
                    </span>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Quantization index</th>
                  <td className="css-7sa0gy">
                    <div className="css-full"></div>
                  </td>
                  <td className="css-7sa0gy">
                    <div className="css-full"></div>
                  </td>
                  <td className="css-7sa0gy">
                    <div className="css-zero"></div>
                  </td>
                </tr>
                <tr className="content" style={{ display: "none" }}>
                  <td colSpan="5">
                    <span>Quantization index</span>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Hash index</th>
                  <td className="css-7sa0gy">
                    <div className="css-full"></div>
                  </td>
                  <td className="css-7sa0gy">
                    <div className="css-full"></div>
                  </td>
                  <td className="css-7sa0gy">
                    <div className="css-zero"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Graph index</th>
                  <td className="css-7sa0gy">
                    <div className="css-full"></div>
                  </td>
                  <td className="css-7sa0gy">
                    <div className="css-zero"></div>
                  </td>
                  <td className="css-7sa0gy">
                    <div className="css-full"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">High availability</th>
                  <td className="css-7sa0gy">
                    <div className="css-full"></div>
                  </td>
                  <td className="css-7sa0gy">
                    <div className="css-zero"></div>
                  </td>
                  <td className="css-7sa0gy">
                    <div className="css-zero"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Distributed architecture</th>
                  <td className="css-7sa0gy">
                    <div className="css-full"></div>
                  </td>
                  <td className="css-7sa0gy">
                    <div className="css-zero"></div>
                  </td>
                  <td className="css-7sa0gy">
                    <div className="css-zero"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Easy-to-use user interface</th>
                  <td className="css-7sa0gy">
                    <div className="css-full"></div>
                  </td>
                  <td className="css-7sa0gy">
                    <div className="css-zero"></div>
                  </td>
                  <td className="css-7sa0gy">
                    <div className="css-zero"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">GUI monitoring dashboard</th>
                  <td className="css-7sa0gy">
                    <div className="css-full"></div>
                  </td>
                  <td className="css-7sa0gy">
                    <div className="css-zero"></div>
                  </td>
                  <td className="css-7sa0gy">
                    <div className="css-zero"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Simple deployment</th>
                  <td className="css-7sa0gy">
                    <div className="css-full"></div>
                  </td>
                  <td className="css-7sa0gy">
                    <div className="css-zero"></div>
                  </td>
                  <td className="css-7sa0gy">
                    <div className="css-zero"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">C++/Python SDK</th>
                  <td className="css-7sa0gy">
                    <div className="css-full"></div>
                  </td>
                  <td className="css-7sa0gy">
                    <div className="css-full"></div>
                  </td>
                  <td className="css-7sa0gy">
                    <div className="css-full"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">RESTful API </th>
                  <td className="css-7sa0gy">
                    <div className="css-full"></div>
                  </td>
                  <td className="css-7sa0gy">
                    <div className="css-zero"></div>
                  </td>
                  <td className="css-7sa0gy">
                    <div className="css-zero"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Enterprise user support</th>
                  <td className="css-7sa0gy">
                    <div className="css-full"></div>
                  </td>
                  <td className="css-7sa0gy">
                    <div className="css-zero"></div>
                  </td>
                  <td className="css-7sa0gy">
                    <div className="css-zero"></div>
                  </td>
                </tr>
              </tbody>
            </table>

            <table className="table text-center mt-5 d-table d-lg-none">
              <tbody>
                <tr>
                  <td className="text-center border-0 tb-hd" colSpan="2">
                    <h2 className="font-weight-light">Milvus</h2>
                  </td>
                </tr>
                <tr>
                  <th scope="row">
                    CPU/GPU heterogeneous computing capability
                  </th>
                  <td className="css-7sa0gy">
                    <div className="css-full"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Quantization index</th>
                  <td className="css-7sa0gy">
                    <div className="css-full"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Hash index</th>
                  <td className="css-7sa0gy">
                    <div className="css-full"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Graph index</th>
                  <td className="css-7sa0gy">
                    <div className="css-full"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">High availability</th>
                  <td className="css-7sa0gy">
                    <div className="css-full"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Distributed architecture</th>
                  <td className="css-7sa0gy">
                    <div className="css-full"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Easy-to-use user interface</th>
                  <td className="css-7sa0gy">
                    <div className="css-full"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">GUI monitoring dashboard</th>
                  <td className="css-7sa0gy">
                    <div className="css-full"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Simple deployment</th>
                  <td className="css-7sa0gy">
                    <div className="css-full"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">C++/Python SDK</th>
                  <td className="css-7sa0gy">
                    <div className="css-full"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">RESTful API</th>
                  <td className="css-7sa0gy">
                    <div className="css-full"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Enterprise user support</th>
                  <td className="css-7sa0gy">
                    <div className="css-full"></div>
                  </td>
                </tr>
              </tbody>
            </table>

            <table className="table text-center mt-5 d-table d-lg-none">
              <tbody>
                <tr>
                  <td className="text-center tb-hd" colSpan="2">
                    <h2 className="font-weight-light">FAISS</h2>
                  </td>
                </tr>
                <tr>
                  <th scope="row">
                    CPU/GPU heterogeneous computing capability
                  </th>
                  <td className="css-7sa0gy">
                    <div className="css-full"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Quantization index</th>
                  <td className="css-7sa0gy">
                    <div className="css-full"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Hash index</th>
                  <td className="css-7sa0gy">
                    <div className="css-full"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Graph index</th>
                  <td className="css-7sa0gy">
                    <div className="css-zero"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">High availability</th>
                  <td className="css-7sa0gy">
                    <div className="css-zero"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Distributed architecture</th>
                  <td className="css-7sa0gy">
                    <div className="css-zero"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Easy-to-use user interface</th>
                  <td className="css-7sa0gy">
                    <div className="css-zero"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">GUI monitoring dashboard</th>
                  <td className="css-7sa0gy">
                    <div className="css-zero"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Simple deployment</th>
                  <td className="css-7sa0gy">
                    <div className="css-zero"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">C++/Python SDK</th>
                  <td className="css-7sa0gy">
                    <div className="css-full"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">RESTful API</th>
                  <td className="css-7sa0gy">
                    <div className="css-zero"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Enterprise user support</th>
                  <td className="css-7sa0gy">
                    <div className="css-zero"></div>
                  </td>
                </tr>
              </tbody>
            </table>

            <table className="table text-center mt-5 d-table d-lg-none">
              <tbody>
                <tr>
                  <td className="text-center tb-hd" colSpan="2">
                    <h2 className="font-weight-light">SPTAG</h2>
                  </td>
                </tr>
                <tr>
                  <th scope="row">
                    CPU/GPU heterogeneous computing capability
                  </th>
                  <td className="css-7sa0gy">
                    <div className="css-zero"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Quantization index</th>
                  <td className="css-7sa0gy">
                    <div className="css-zero"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Hash index</th>
                  <td className="css-7sa0gy">
                    <div className="css-zero"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Graph index</th>
                  <td className="css-7sa0gy">
                    <div className="css-full"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">High availability</th>
                  <td className="css-7sa0gy">
                    <div className="css-zero"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Distributed architecture</th>
                  <td className="css-7sa0gy">
                    <div className="css-zero"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Easy-to-use user interface</th>
                  <td className="css-7sa0gy">
                    <div className="css-zero"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">GUI monitoring dashboard</th>
                  <td className="css-7sa0gy">
                    <div className="css-zero"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Simple deployment</th>
                  <td className="css-7sa0gy">
                    <div className="css-zero"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">C++/Python SDK</th>
                  <td className="css-7sa0gy">
                    <div className="css-full"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">RESTful API</th>
                  <td className="css-7sa0gy">
                    <div className="css-zero"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Enterprise user support</th>
                  <td className="css-7sa0gy">
                    <div className="css-zero"></div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      );
    };

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
