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
          <div className=" ">
            <div className="row splash-content">
              <div className="col-12 col-md-12">
                {/* <img alt="logo" className="fdb-icon" src={`${baseUrl}images/icons/coffee.svg`} /> */}
                <p className="lead text-secondary">
                  An Open Source Vector Similarity Search Engine
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
                      className="github-button"
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
                  Milvus is an open source similarity search engine for massive-scale
                  feature vectors. Built with heterogeneous computing
                  architecture for the best cost efficiency. Searches over
                  billion-scale vectors take only milliseconds with minimum
                  computing resources. Milvus can be used in a wide variety of
                  scenarios to boost AI development.
                  <br />
                  <br />
                  Welcome to use our product and follow us on{" "}
                  <br />
                  <br />

                  <a
                    className="milvus-btn"
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

            <div className="feature-wrapper">
              <div className="feature">
                <img
                  alt="Heterogeneous computing"
                  src={`${baseUrl}new-images/icon-1.png`}
                />
                <h3>
                  <strong>Heterogeneous computing</strong>
                </h3>
                <p>
                  Milvus is designed with heterogeneous computing architecture
                  for the best performance and cost efficiency.
                </p>
              </div>

              <div className="feature ">
                <img
                  alt="Multiple indexes"
                  src={`${baseUrl}new-images/icon-2.png`}
                />
                <h3>
                  <strong>Multiple indexes</strong>
                </h3>
                <p>
                  Milvus supports a variety of indexing types that employs
                  quantization, tree-based, and graph indexing techniques.
                </p>
              </div>

              <div className="feature ">
                <img
                  alt="Intelligent resource management"
                  src={`${baseUrl}new-images/icon-5.png`}
                />
                <h3>
                  <strong>Intelligent resource management</strong>
                </h3>
                <p>
                  Milvus automatically adapts search computation and index
                  building processes based on your datasets and available
                  resources.
                </p>
              </div>

              <div className="feature ">
                <img
                  alt="Horizontal scalability"
                  src={`${baseUrl}new-images/icon-3.png`}
                />
                <h3>
                  <strong>Horizontal scalability</strong>
                </h3>
                <p>
                  Milvus supports online / offline expansion to scale both
                  storage and computation resources with simple commands.
                </p>
              </div>

              <div className="feature ">
                <img
                  alt="High Availability"
                  src={`${baseUrl}new-images/icon-4.png`}
                />
                <h3>
                  <strong>High availability</strong>
                </h3>
                <p>
                  Milvus is integrated with Kubernetes framework so that all
                  single point of failures could be avoided.
                </p>
              </div>

              <div className="feature ">
                <img
                  alt="Easy to use"
                  src={`${baseUrl}new-images/icon-6.png`}
                />
                <h3>
                  <strong>Ease of use</strong>
                </h3>
                <p>
                  Milvus can be easily installed in a few steps and supports
                  Prometheus-based GUI monitor. dashboards.
                </p>
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
                <h1>Vector Search Tool Comparison</h1>
              </div>
            </div>
            <table className="table text-center mt-5 d-none d-lg-table">
              <tbody>
                <tr>
                  <th scope="row" className="border-0 tb-hd"></th>
                  <td className="text-center border-0 tb-hd">
                    <h3 className="font-weight-light">Milvus</h3>
                  </td>
                  <td className="text-center border-0 tb-hd">
                    <h3 className="font-weight-light">FAISS</h3>
                  </td>
                  <td className="text-center border-0 tb-hd">
                    <h3 className="font-weight-light">SPTAG</h3>
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
                  <th scope="row">Python/JAVA/C++ SDK</th>
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
                    <h3 className="font-weight-light">Milvus</h3>
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
                  <th scope="row">Python/JAVA/C++ SDK</th>
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
                    <h3 className="font-weight-light">FAISS</h3>
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
                  <th scope="row">Python/JAVA/C++ SDK</th>
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
                    <h3 className="font-weight-light">SPTAG</h3>
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
                  <th scope="row">Python/JAVA/C++ SDK</th>
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
      <div className="page wrapper">
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
