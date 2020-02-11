import React, { useState } from "react";
import MyInput from "../components/input"
import MySelector from "../components/selector"
import Logo from "../images/logo.svg"
import SEO from "../components/seo";
import "../scss/tool.scss";

const DATA_TYPES = ["Float", "Bytes"]
const INDEX_TYPES = ["FLAT", "IVFFLAT", "IVFSQ8", "IVFSQ8H", "IVFPQ"];

const NotFoundPage = ({ data, pageContext }) => {
  const [dataType, setDataType] = useState("Float")
  const [indexType, setIndexType] = useState("IVFFLAT")
  const [deployType, setDeployType] = useState(0) // 0 single 1 cluster
  const [vector, setVector] = useState(null)
  const [dimensions, setDimensions] = useState(null)
  const [nodes, setNodes] = useState(0)
  const [errorText, setErrorText] = useState("")
  const [diskSize, setDiskSize] = useState(null)
  const [ramSize, setRamSize] = useState(null)

  const handleChange = e => {
    setDeployType(Number(e.currentTarget.value))
  }


  const handleCompute = () => {
    const numRegx = /^[0-9]*$/
    if (!numRegx.test(vector) || vector < 0) {
      setErrorText("The num of vectors must above 0.")
      return
    }
    if (!numRegx.test(dimensions) || dimensions > 16384 || 16384 < 0) {
      setErrorText("The dimensions value between (0,16384].")
      return
    }
    if (!numRegx.test(nodes) || nodes < 0) {
      setErrorText("The num of cluster must above 0.")
      return
    }
    setErrorText("")

    let sizeStatus = 1
    let size = vector * dimensions * 4 / 1024
    let status = "KB"
    let diskSize = 0
    let ramSize = 0

    while (sizeStatus < 3 && size > 4096) {
      size = size / 1024
      status = "MB"
      sizeStatus++
    }
    if (sizeStatus === 3) {
      status = "GB"
    }
    if (dataType === "Float") {
      if (indexType === "IVFSQ8" || indexType === "IVFSQ8H") {
        diskSize = parseInt(size * 1.3) + 1
        ramSize = parseInt(size * 0.3) + 1
      } else {
        diskSize = parseInt(size * 2) + 1
        ramSize = parseInt(size) + 1
      }
    } else if (dataType === 'Bytes') {
      diskSize = parseInt(size / 32 * 2) + 1
      ramSize = parseInt(size / 32) + 1
    }

    if (deployType === 1) {
      ramSize = parseInt(ramSize + 4 * nodes)
    }
    setDiskSize(`${diskSize}${status}`)
    setRamSize(`${ramSize}${status}`)
  }

  return (
    <>
      <SEO title="Milvus tool" />
      <div className="tool-wrapper">
        <div className="left-container">
          <div className="logo">
            <img src={Logo} alt="Milvus Logo" className="logo"></img>
            <p>Sizing Tool</p>
          </div>
          <div className="error">{errorText}</div>
          <form>
            <div className="form-item">
              <p>Number of Vectors</p>
              <MyInput setValue={setVector} placeholder="The num of vectors must above 0"></MyInput>
            </div>
            <div className="form-item">
              <p>Dimensions</p>
              <MyInput setValue={setDimensions} placeholder="value is (0,16384]"></MyInput>
            </div>
            <div className="form-item">
              <p>Data Type</p>
              <MySelector
                options={DATA_TYPES}
                selected={dataType}
                setSelected={setDataType}
              ></MySelector>
            </div>
            <div className="form-item">
              <p>Index Type</p>
              <MySelector
                options={INDEX_TYPES}
                selected={indexType}
                setSelected={setIndexType}
              ></MySelector>
            </div>
            <div className="form-item">
              <p>Deployment</p>
              <label className={`radio-item ${deployType === 0 && 'active'}`}>
                <input type="radio" name="deployType" value={0} checked={deployType === 0} onChange={handleChange}></input>
                single node deployment
              </label>
              <label className={`radio-item ${deployType === 1 && 'active'}`}>
                <input type="radio" name="deployType" value={1} checked={deployType === 1} onChange={handleChange}></input>
                cluster deployment
              </label>
              {
                deployType === 1 && (
                  <div style={{ paddingLeft: "24px", marginTop: "10px" }}>
                    <MyInput placeholder="number of nodes must above 0" setValue={setNodes}></MyInput>
                  </div>
                )
              }
            </div>
            <div className="form-item btn-wrapper" >
              {/* eslint-disable-next-line */}
              <span className="button" onClick={handleCompute}  >Compute</span>

            </div>
          </form>
        </div>
        <div className="right-container">
          <section>
            <p className="title">Requirements</p>
            <ul>
              <li>
                <span>Vevtors</span>
                <span className="value">{vector}</span>
              </li>
              <li>
                <span>Dimensions</span>
                <span className="value">{dimensions}</span>
              </li>
              <li>
                <span>Data Type</span>
                <span className="value">{dataType}</span>
              </li>
              <li>
                <span>Index Type</span>
                <span className="value">{indexType}</span>
              </li>
              {
                deployType === 1 && (
                  <li>
                    <span>Cluster</span>
                    <span className="value">{nodes}</span>
                  </li>
                )
              }
            </ul>
          </section>
          <section style={{ marginTop: "40px" }}>
            <p className="title">Recommandation</p>
            <ul>
              <li>
                <span>Memory</span>
                <span className="value">{ramSize}</span>
              </li>
              <li>
                <span>Disk</span>
                <span className="value">{diskSize}</span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </>

  );
};

export const Query = graphql`
  query toolQuery($locale: String) {
    allFile(filter: { name: { eq: $locale } }) {
      edges {
        node {
          childLayoutJson {
            layout {
              notFound
              header {
                about
                doc
                blog
                try
                loading
                noresult
              }
              footer {
                product {
                  title
                  txt1
                  txt2
                }
                doc {
                  title
                  txt1
                  txt2
                  txt3
                }
                resource {
                  title
                  txt1
                  txt2
                  txt3
                  txt4
                }
                contact {
                  title
                }
              }
              home {
                section1 {
                  desc1
                  desc2
                  link
                }
                section2 {
                  title
                  content
                  link
                }
                section3 {
                  title
                  list {
                    title
                    content
                  }
                }
                section4 {
                  title
                  list
                }
              }
            }
          }
        }
      }
    }
  }
`;

export default NotFoundPage;
