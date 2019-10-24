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
          <div className="row splash-content">
            <div className="col-12 col-md-12">
              {/* <img alt="logo" className="fdb-icon" src={`${baseUrl}images/icons/coffee.svg`} /> */}
              <p className="lead text-secondary">
              开源向量相似度搜索引擎
              </p>
              <div style={{ display: "flex", alignItems: "center" }}>
                <p className="main-button">
                  <a
                    href={this.docUrl("aboutmilvus/overview", language)}
                    className="milvus-btn"
                  >
                    为什么选择Milvus
                  </a>
                </p>
                <div className="githubicon">
                  <a
                    className="github-button"
                    href="https://github.com/milvus-io/milvus"
                    data-color-scheme="no-preference: light; light: light; dark: dark;"
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
                <h1>什么是 Milvus</h1>
                <p className="lead">
                  Milvus
                  是一款开源的、针对海量特征向量的相似性搜索引擎。基于异构众核计算框架设计，成本更低，性能更好。
                  在有限的计算资源下，十亿向量搜索仅毫秒响应。Milvus
                  能够广泛应用于各种 AI 场景，为 AI 发展提供有效助力。
                  <br />
                  <br />
                  欢迎使用我们的产品并在 GitHub 上 <a href="https://github.com/milvus-io/milvus" title="https://github.com/milvus-io/milvus">关注 Milvus</a>
                  <br />
                  <br />
                  <a
                    className="milvus-btn"
                    href={this.docUrl("aboutmilvus/overview", language)}
                  >
                    点击详情
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
                <h1>Milvus 特性</h1>
              </div>
            </div>

            <div className="feature-wrapper">
              <div className="feature">
                <img
                  alt="异构众核"
                  src={`${baseUrl}new-images/icon-1.png`}
                />
                <h3>
                  <strong>异构众核</strong>
                </h3>
                <p>
                Milvus 使用异构众核计算处理特征向量，成本更低，性能更好。</p>
              </div>

              <div className="feature ">
                <img
                  alt="多元化索引"
                  src={`${baseUrl}new-images/icon-2.png`}
                />
                <h3>
                  <strong>多元化索引</strong>
                </h3>
                <p>Milvus 支持多种索引方式，使用量化索引、基于树的索引和图索引等算法。</p>
              </div>

              <div className="feature ">
                <img
                  alt="资源智能管理"
                  src={`${baseUrl}new-images/icon-5.png`}
                />
                <h3>
                  <strong>资源智能管理</strong>
                </h3>
                <p>Milvus 根据实际数据规模和可利用资源，智能调节优化查询计算和索引构建过程。</p>
              </div>

              <div className="feature ">
                <img
                  alt="水平扩容"
                  src={`${baseUrl}new-images/icon-3.png`}
                />
                <h3>
                  <strong>水平扩容</strong>
                </h3>
                <p>Milvus 支持在线 / 离线扩容，仅需执行简单命令，便可弹性伸缩计算节点和存储节点。</p>
              </div>

              <div className="feature ">
                <img
                  alt="高可用性"
                  src={`${baseUrl}new-images/icon-4.png`}
                />
                <h3>
                  <strong>高可用性</strong>
                </h3>
                <p>Milvus 集成了 Kubernetes 框架，能有效避免单点障碍情况的发生。</p>
              </div>

              <div className="feature ">
                <img
                  alt="简单易用"
                  src={`${baseUrl}new-images/icon-6.png`}
                />
                <h3>
                  <strong>简单易用</strong>
                </h3>
                <p>
                Milvus 安装简单，使用方便。支持使用基于 Prometheus 的图形化监控，方便您实时跟踪系统性能。
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
                <h1>Milvus 架构</h1>
                <p className="lead">
                  Milvus系统由四部分组成：Milvus Server，Storage Cluster，Meta
                  Management，Milvus Monitoring
                </p>
                <p className="mt-4">
                  <a
                    href={this.docUrl(
                      "UserGuide/#system-architecture",
                      language
                    )}
                    className="btn btn-secondary"
                  >
                    点击查看详细Milvus架构信息
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
                <h1>向量检索工具对比</h1>
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
                    CPU/GPU 异构计算能力
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
                  <th scope="row">量化索引</th>
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
                  <th scope="row">哈希索引</th>
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
                  <th scope="row">图索引</th>
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
                  <th scope="row">高可用设计</th>
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
                  <th scope="row">分布式架构</th>
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
                  <th scope="row">易用标准化用户接口</th>
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
                  <th scope="row">图形仪表盘</th>
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
                  <th scope="row">快速开发</th>
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
                  <th scope="row">企业级用户支持</th>
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
                  <th scope="row">CPU/GPU 异构计算能力</th>
                  <td className="css-7sa0gy">
                    <div className="css-full"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">量化索引</th>
                  <td className="css-7sa0gy">
                    <div className="css-full"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">哈希索引</th>
                  <td className="css-7sa0gy">
                    <div className="css-full"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">图索引</th>
                  <td className="css-7sa0gy">
                    <div className="css-full"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">高可用设计</th>
                  <td className="css-7sa0gy">
                    <div className="css-full"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">分布式架构</th>
                  <td className="css-7sa0gy">
                    <div className="css-full"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">易用标准化用户接口</th>
                  <td className="css-7sa0gy">
                    <div className="css-full"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">图形仪表盘</th>
                  <td className="css-7sa0gy">
                    <div className="css-full"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">快速开发</th>
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
                  <th scope="row">企业级用户支持</th>
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
                  <th scope="row">CPU/GPU异构计算能力</th>
                  <td className="css-7sa0gy">
                    <div className="css-full"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">量化索引</th>
                  <td className="css-7sa0gy">
                    <div className="css-full"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">哈希索引</th>
                  <td className="css-7sa0gy">
                    <div className="css-full"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">图索引</th>
                  <td className="css-7sa0gy">
                    <div className="css-zero"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">高可用设计</th>
                  <td className="css-7sa0gy">
                    <div className="css-zero"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">分布式架构</th>
                  <td className="css-7sa0gy">
                    <div className="css-zero"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">易用标准化用户接口</th>
                  <td className="css-7sa0gy">
                    <div className="css-zero"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">图形仪表盘</th>
                  <td className="css-7sa0gy">
                    <div className="css-zero"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">快速开发</th>
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
                  <th scope="row">企业级用户支持</th>
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
                  <th scope="row">CPU/GPU异构计算能力</th>
                  <td className="css-7sa0gy">
                    <div className="css-zero"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">量化索引</th>
                  <td className="css-7sa0gy">
                    <div className="css-zero"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">哈希索引</th>
                  <td className="css-7sa0gy">
                    <div className="css-zero"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">图索引</th>
                  <td className="css-7sa0gy">
                    <div className="css-full"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">高可用设计</th>
                  <td className="css-7sa0gy">
                    <div className="css-zero"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">分布式架构</th>
                  <td className="css-7sa0gy">
                    <div className="css-zero"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">易用标准化用户接口</th>
                  <td className="css-7sa0gy">
                    <div className="css-zero"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">图形仪表盘</th>
                  <td className="css-7sa0gy">
                    <div className="css-zero"></div>
                  </td>
                </tr>
                <tr>
                  <th scope="row">快速开发</th>
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
                  <th scope="row">企业级用户支持</th>
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
