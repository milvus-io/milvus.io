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
                <p className="lead text-secondary">高速智能向量检索数据库</p>
                <p className="mt-5"><a href={this.docUrl('QuickStart', language)} className="btn btn-primary">为什么选择Milvus</a></p>
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
                <h1>什么是Milvus</h1>
                <p className="lead">
                Milvus是ZILLIZ公司研发的一款分布式智能向量检索分析系统。基于GPU/CPU异构众核框架构建，让您能在毫秒间轻松处理数十亿级数据。
                <br /><a href={this.docUrl('vectordb/milvus-db', language)}>点击详情</a>
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
                <h1>Milvus 特性</h1>
              </div>
            </div>
            <div className="row text-left mt-5">
              <div className="col-12 col-md-4">
                <div className="row">
                  <div className="col-3 paddingTop10">
                    <img alt="f1" className="fdb-icon" src={`${baseUrl}images/icons/layout.svg`} />
                  </div>
                  <div className="col-9">
                    <h3><strong>性能卓越</strong></h3>
                    <p>通过异构处理架构大幅提高索引构建的速度。</p>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-4 pt-3 pt-sm-4 pt-md-0">
                <div className="row">
                  <div className="col-3 paddingTop10">
                    <img alt="f2" className="fdb-icon" src={`${baseUrl}images/icons/layers.svg`} />
                  </div>
                  <div className="col-9">
                    <h3><strong>智能索引</strong></h3>
                    <p>提供针对向量检索的多种索引技术，可以根据查询数据集的规模、数据分布、查询精度以及索引构建速度，智能选择不同的向量索引。</p>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-4 pt-3 pt-sm-4 pt-md-0">
                <div className="row">
                  <div className="col-3 paddingTop10">
                    <img alt="f3" className="fdb-icon" src={`${baseUrl}images/icons/map.svg`} />
                  </div>
                  <div className="col-9">
                    <h3><strong>弹性伸缩</strong></h3>
                    <p>实现了计算与存储分离架构，可随着业务扩展，弹性伸缩计算节点和存储节点。</p>
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
                    <h3><strong>高可用性</strong></h3>
                    <p>分布式集群架构能在少数节点故障时提供持续的服务能力。</p>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-4 pt-3 pt-sm-4 pt-md-0">
                <div className="row">
                  <div className="col-3 paddingTop10">
                    <img alt="f5" className="fdb-icon" src={`${baseUrl}images/icons/package.svg`} />
                  </div>
                  <div className="col-9">
                    <h3><strong>全面兼容</strong></h3>
                    <p>兼容各种人工智能训练模型，和主流开发语言。</p>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-4 pt-3 pt-sm-4 pt-md-0">
                <div className="row">
                  <div className="col-3 paddingTop10">
                    <img alt="f6" className="fdb-icon" src={`${baseUrl}images/icons/monitor.svg`} />
                  </div>
                  <div className="col-9">
                    <h3><strong>高易用性</strong></h3>
                    <p>Milvus提供了基于Python/C++的客户端SDK，并提供了可视化监控面板，以及基于图形化和命令行管理工具。</p>
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
                <tr>
                  <th scope="row" className="border-0">CPU/GPU异构计算能力</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                </tr>
                <tr>
                  <th scope="row">量化索引</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                </tr>
                <tr>
                  <th scope="row" >哈希索引</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                </tr>
                <tr>
                  <th scope="row">图索引</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                </tr>
                <tr>
                  <th scope="row">高可用设计</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
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
                  <th scope="row">图形仪表盘</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                </tr>
                <tr>
                  <th scope="row">快速开发</th>
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
                  <th scope="row">企业级用户支持</th>
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
                  <th scope="row">CPU/GPU异构计算能力</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                </tr>
                <tr>
                  <th scope="row">量化索引</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                </tr>
                <tr>
                  <th scope="row">哈希索引</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                </tr>
                <tr>
                  <th scope="row">图索引</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                </tr>
                <tr>
                  <th scope="row">高可用设计</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                </tr>
                <tr>
                  <th scope="row">分布式架构</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                </tr>
                <tr>
                  <th scope="row">易用标准化用户接口</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                </tr>
                <tr>
                  <th scope="row">图形仪表盘</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                </tr>
                <tr>
                  <th scope="row">快速开发</th>
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
                  <th scope="row">企业级用户支持</th>
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
                  <th scope="row">CPU/GPU异构计算能力</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                </tr>
                <tr>
                  <th scope="row">量化索引</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                </tr>
                <tr>
                  <th scope="row">哈希索引</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                </tr>
                <tr>
                  <th scope="row">图索引</th>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                </tr>
                <tr>
                  <th scope="row">高可用设计</th>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                </tr>
                <tr>
                  <th scope="row">分布式架构</th>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                </tr>
                <tr>
                  <th scope="row">易用标准化用户接口</th>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                </tr>
                <tr>
                  <th scope="row">图形仪表盘</th>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                </tr>
                <tr>
                  <th scope="row">快速开发</th>
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
                  <th scope="row">企业级用户支持</th>
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
                  <th scope="row">CPU/GPU异构计算能力</th>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                </tr>
                <tr>
                  <th scope="row">量化索引</th>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                </tr>
                <tr>
                  <th scope="row">哈希索引</th>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                </tr>
                <tr>
                  <th scope="row">图索引</th>
                  <td className="css-7sa0gy"><div className="css-full"></div></td>
                </tr>
                <tr>
                  <th scope="row">高可用设计</th>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                </tr>
                <tr>
                  <th scope="row">分布式架构</th>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                </tr>
                <tr>
                  <th scope="row">易用标准化用户接口</th>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                </tr>
                <tr>
                  <th scope="row">图形仪表盘</th>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
                </tr>
                <tr>
                  <th scope="row">快速开发</th>
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
                  <th scope="row">企业级用户支持</th>
                  <td className="css-7sa0gy"><div className="css-zero"></div></td>
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
        {/* <TechAndArch /> */}
        <Comparison />
      </div>
    );
  }
}

module.exports = Index;
