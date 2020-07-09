import React, { useState, useEffect } from "react";
import { graphql } from "gatsby";
import MyInput from "../components/input";
import MySelector from "../components/selector";
import Logo from "../images/logo.svg";
import SEO from "../components/seo";
import "../scss/tool.scss";

const DATA_TYPES = ["Float", "Bytes"];
// const INDEX_TYPES = ["FLAT", "IVFFLAT", "IVFSQ8", "IVFSQ8H", "IVFPQ"];

const ToolSizing = () => {
  const [dataType, setDataType] = useState("Float");
  // const [indexType, setIndexType] = useState("IVFFLAT")
  const [deployType, setDeployType] = useState(0); // 0 single 1 cluster
  const [vector, setVector] = useState(0);
  const [dimensions, setDimensions] = useState(0);
  const [nodes, setNodes] = useState(0);
  const [errorText, setErrorText] = useState("");
  const [diskSize, setDiskSize] = useState({});
  const [ramSize, setRamSize] = useState({});
  const [sizeStatus, setSizeStatus] = useState("");

  const handleChange = (e) => {
    setDeployType(Number(e.currentTarget.value));
    setNodes(0);
  };

  const generateSize = (size, IVFSQSize) => {
    return {
      IVFSQ8: IVFSQSize || size,
      IVFSQ8H: IVFSQSize || size,
      FLAT: size,
      IVFFLAT: size,
      IVFPQ: size,
    };
  };
  const compute = () => {
    const numRegx = /^[0-9]*$/;
    console.log(dimensions);
    if (!numRegx.test(vector) || vector < 0) {
      setErrorText("The num of vectors must above 0.");
      return;
    }
    if (!numRegx.test(dimensions) || dimensions > 16384 || 16384 < 0) {
      setErrorText("The dimensions value between (0,16384].");
      return;
    }
    if (!numRegx.test(nodes) || nodes < 0) {
      setErrorText("The num of cluster must above 0.");
      return;
    }
    setErrorText("");

    let sizeStatus = 1;
    let size = (vector * dimensions * 4) / 1024;
    let status = "KB";
    let diskSize = {};
    let ramSize = {};

    while (sizeStatus < 4 && size > 4096) {
      size = size / 1024;
      status = "MB";
      sizeStatus++;
    }
    if (sizeStatus === 3) {
      status = "GB";
    } else if (sizeStatus === 4) {
      status = "TB";
    }
    if (dataType === "Float") {
      const IVFSQDisk = Math.ceil(size * 1.3);
      const IVFSQRam = Math.ceil(size * 0.3);
      const disk = Math.ceil(size * 2);
      const ram = Math.ceil(size);
      diskSize = generateSize(disk, IVFSQDisk);
      ramSize = generateSize(ram, IVFSQRam);
    } else if (dataType === "Bytes") {
      const disk = Math.ceil((size / 32) * 2);
      const ram = Math.ceil(size / 32);
      diskSize = generateSize(disk);
      ramSize = generateSize(ram);
    }

    if (deployType === 1) {
      for (let key in ramSize) {
        ramSize[key] = parseInt(Number(ramSize[key]) + 4 * nodes);
      }
    }
    setDiskSize(diskSize);
    setRamSize(ramSize);
    setSizeStatus(status);
  };
  useEffect(() => {
    compute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vector, dimensions, dataType, nodes]);

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
              <MyInput
                setValue={setVector}
                placeholder="The num of vectors must above 0"
              ></MyInput>
            </div>
            <div className="form-item">
              <p>Dimensions</p>
              <MyInput
                setValue={setDimensions}
                placeholder="value is (0,16384]"
              ></MyInput>
            </div>
            <div className="form-item">
              <p>Data Type</p>
              <MySelector
                options={DATA_TYPES}
                selected={dataType}
                setSelected={setDataType}
              ></MySelector>
            </div>
            {/* <div className="form-item">
              <p>Index Type</p>
              <MySelector
                options={INDEX_TYPES}
                selected={indexType}
                setSelected={setIndexType}
              ></MySelector>
            </div> */}
            <div className="form-item">
              <p>Deployment</p>
              <label className={`radio-item ${deployType === 0 && "active"}`}>
                <input
                  type="radio"
                  name="deployType"
                  value={0}
                  checked={deployType === 0}
                  onChange={handleChange}
                ></input>
                single node deployment
              </label>
              <label className={`radio-item ${deployType === 1 && "active"}`}>
                <input
                  type="radio"
                  name="deployType"
                  value={1}
                  checked={deployType === 1}
                  onChange={handleChange}
                ></input>
                cluster deployment
              </label>
              {deployType === 1 && (
                <div style={{ paddingLeft: "24px", marginTop: "10px" }}>
                  <MyInput
                    placeholder="number of nodes must above 0"
                    setValue={setNodes}
                  ></MyInput>
                </div>
              )}
            </div>
          </form>
        </div>
        <div className="right-container">
          <section>
            <p className="title">Requirements</p>
            <ul>
              <li>
                <span className="label">Vectors</span>
                <span className="value">{vector}</span>
              </li>
              <li>
                <span className="label">Dimensions</span>
                <span className="value">{dimensions}</span>
              </li>
              <li>
                <span className="label">Data Type</span>
                <span className="value">{dataType}</span>
              </li>
              {/* <li>
                <span className="label">Index Type</span>
                <span className="value">{indexType}</span>
              </li> */}
              {deployType === 1 && (
                <li>
                  <span>Cluster</span>
                  <span className="value">{nodes}</span>
                </li>
              )}
            </ul>
          </section>
          <section style={{ marginTop: "40px" }}>
            <p className="title">Recommendation</p>
            <table style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th></th>
                  <th>FLAT</th>
                  <th>IVFFLAT</th>
                  {dataType === "Float" && (
                    <>
                      <th>IVFSQ8</th>
                      <th>IVFSQ8H</th>
                      <th>IVFPQ</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Memory</td>
                  <td>{ramSize["FLAT"] + sizeStatus}</td>
                  <td>{ramSize["IVFFLAT"] + sizeStatus}</td>
                  {dataType === "Float" && (
                    <>
                      <td>{ramSize["IVFSQ8"] + sizeStatus}</td>
                      <td>{ramSize["IVFSQ8H"] + sizeStatus}</td>
                      <td>{ramSize["IVFPQ"] + sizeStatus}</td>
                    </>
                  )}
                </tr>
                <tr>
                  <td>Disk</td>
                  <td>{diskSize["FLAT"] + sizeStatus}</td>
                  <td>{diskSize["IVFFLAT"] + sizeStatus}</td>
                  {dataType === "Float" && (
                    <>
                      <td>{diskSize["IVFSQ8"] + sizeStatus}</td>
                      <td>{diskSize["IVFSQ8H"] + sizeStatus}</td>
                      <td>{diskSize["IVFPQ"] + sizeStatus}</td>
                    </>
                  )}
                </tr>
              </tbody>
            </table>
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
                gui
                doc
                blog
                try
                loading
                noresult
                search
                bootcamp
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
                  wechat
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
              }
            }
          }
        }
      }
    }
  }
`;

export default ToolSizing;
