import React, { useState, useEffect } from "react";
import Seo from "../components/seo";
import * as styles from "./common-layout.module.less";
import sizingToolLogo from "../images/sizing-tool/milvusSizingTool.svg";
import TextFiled from "../components/textField";
import CustomTable from "../components/customTable";
import TableColumn from "../components/customTable/tableColumn";

import { graphql } from "gatsby";
import Layout from "../components/layout";

import {
  computMilvusRecommonds,
  formatSize,
  formatVectors,
} from "../utils/sizingTool";
import { Link, useI18next } from "gatsby-plugin-react-i18next";

const [TITLE, DESCRIPTION] = [
  "Milvus Sizing Tool",
  "Discover the ideal vector indexing type for your application.",
];

const SizingTool = () => {
  const { language, t } = useI18next();

  const MHint = (
    <div className={styles.mHint}>
      <p>
        <strong>CPU only:</strong> Milvus: m ≡ dim (mod m);
      </p>
      <br />
      <p>
        <strong>GPU enabled:</strong> Milvus: m ∈{"{"}1, 2, 3, 4, 8, 12, 16, 20,
        24, 28, 32, 40, 48, 56, 64, 96{"}"}, and (dimension / m) ∈{"{"}1, 2, 3,
        4, 6, 8, 10, 12, 16, 20, 24, 28, 32{"}"}.
        <br />
        (m x 1024) ≥<code> MaxSharedMemPerBlock</code> of your graphics card.
      </p>
    </div>
  );

  const [vectors, setVectors] = useState({
    value: "",
    showError: false,
  });
  const [dimensions, setDimensions] = useState({
    value: "",
    showError: false,
  });
  const [nlist, setNlist] = useState({
    value: "",
    showError: false,
  });
  const [m, setM] = useState({
    value: "",
    showError: false,
  });
  const [segmetFileSize, setsegmetFileSize] = useState({
    value: "",
    showError: false,
  });
  const [isInit, setIsInit] = useState(true);

  const [firstTBody, setFirstTBody] = useState([
    {
      indexType: "FLAT",
      rowFileSize: ". . .",
      memorySize: ". . .",
      stableDiskSize: ". . .",
    },
    {
      indexType: "IVF_FLAT",
      rowFileSize: ". . .",
      memorySize: ". . .",
      stableDiskSize: ". . .",
    },
    {
      indexType: (
        <>
          IVF_SQ8
          <br />
          IVF_SQ8h
        </>
      ),
      rowFileSize: ". . .",
      memorySize: ". . .",
      stableDiskSize: ". . .",
    },
    {
      indexType: "IVF_PQ",
      rowFileSize: ". . .",
      memorySize: ". . .",
      stableDiskSize: ". . .",
    },
  ]);

  const [secondTBody, setSecondTBody] = useState([
    {
      indexType: "FLAT",
      rowFileSize: ". . .",
      memorySize: ". . .",
      stableDiskSize: ". . .",
    },
    {
      indexType: "IVF_FLAT",
      rowFileSize: ". . .",
      memorySize: ". . .",
      stableDiskSize: ". . .",
    },
  ]);

  const onVectorChange = (event) => {
    setIsInit(false);

    const value = event.target.value;
    const vector = Number(value);
    const showError = !Number.isInteger(vector) || vector <= 0;

    setVectors({
      showError,
      value,
    });
  };

  const onDimensionsChange = (event) => {
    setIsInit(false);

    const value = event.target.value;
    const dimension = Number(value);
    const showError =
      !Number.isInteger(dimension) || dimension < 0 || dimension > 1073741824;
    setDimensions({
      showError,
      value,
    });
  };

  const onNlistChange = (event) => {
    setIsInit(false);

    const value = event.target.value;
    const nlist = Number(value);
    const showError = !Number.isInteger(nlist) || nlist < 1 || nlist > 65536;
    setNlist({
      showError,
      value,
    });
  };

  const onMChange = (event) => {
    setIsInit(false);

    const value = event.target.value;

    setM({
      value,
      showError: true,
    });
  };

  const onMFocus = () => {
    setM({
      ...m,
      showError: true,
    });
  };

  const onMBlur = () => {
    setM({
      ...m,
      showError: false,
    });
  };

  const onFileSizeChange = (e) => {
    const value = e.target.value;
    const showError = value < 0 || value > 131072;
    setsegmetFileSize({
      value,
      showError,
    });
  };

  const getTableCellContent = (value) => {
    if (isInit) {
      return ". . .";
    }

    if (isNaN(value)) {
      return <span className={styles.hint}>Missing required parameters</span>;
    }

    return formatSize(value);
  };

  const getVectorTitle = () => {
    const value = vectors.value;
    const vectorNumber = formatVectors(value).toUpperCase();
    return Number(value) === 1 ? (
      <span>
        for <span className={styles.vectorNumber}>1</span> vector{" "}
      </span>
    ) : (
      <span>
        for <span className={styles.vectorNumber}>{vectorNumber}</span> vectors
      </span>
    );
  };

  useEffect(
    () => {
      if (
        !vectors.showError &&
        !dimensions.showError &&
        !nlist.showError &&
        !segmetFileSize.showError
      ) {
        const milvusRecommends = computMilvusRecommonds(
          vectors.value ? Number(vectors.value) : NaN,
          dimensions.value ? Number(dimensions.value) : NaN,
          nlist.value ? Number(nlist.value) : NaN,
          m.value ? Number(m.value) : NaN,
          segmetFileSize.value
            ? Number(segmetFileSize.value) * 1024 * 1024
            : NaN
        );

        setFirstTBody([
          {
            indexType: "FLAT",
            rowFileSize: getTableCellContent(milvusRecommends.rawFileSize.flat),
            memorySize: getTableCellContent(milvusRecommends.memorySize.flat),
            stableDiskSize: getTableCellContent(milvusRecommends.diskSize.flat),
          },
          {
            indexType: "IVF_FLAT",
            rowFileSize: getTableCellContent(
              milvusRecommends.rawFileSize["ivf_flat"]
            ),
            memorySize: getTableCellContent(
              milvusRecommends.memorySize["ivf_flat"]
            ),
            stableDiskSize: getTableCellContent(
              milvusRecommends.diskSize["ivf_flat"]
            ),
          },
          {
            indexType: (
              <>
                IVF_SQ8
                <br />
                IVF_SQ8h
              </>
            ),
            rowFileSize: getTableCellContent(
              milvusRecommends.rawFileSize["ivf_sq8"]
            ),
            memorySize: getTableCellContent(
              milvusRecommends.memorySize["ivf_sq8"]
            ),
            stableDiskSize: getTableCellContent(
              milvusRecommends.diskSize["ivf_sq8"]
            ),
          },
          {
            indexType: "IVF_PQ",
            rowFileSize: getTableCellContent(
              milvusRecommends.rawFileSize["ivf_pq"]
            ),
            memorySize: getTableCellContent(
              milvusRecommends.memorySize["ivf_pq"]
            ),
            stableDiskSize: getTableCellContent(
              milvusRecommends.diskSize["ivf_pq"]
            ),
          },
        ]);

        setSecondTBody([
          {
            indexType: "FLAT",
            rowFileSize: getTableCellContent(
              milvusRecommends.byteRawFileSize.flat
            ),
            memorySize: getTableCellContent(
              milvusRecommends.byteMemorySize.flat
            ),
            stableDiskSize: getTableCellContent(
              milvusRecommends.byteDiskSize.flat
            ),
          },
          {
            indexType: "IVF_FLAT",
            rowFileSize: getTableCellContent(
              milvusRecommends.byteRawFileSize["ivf_flat"]
            ),
            memorySize: getTableCellContent(
              milvusRecommends.byteMemorySize["ivf_flat"]
            ),
            stableDiskSize: getTableCellContent(
              milvusRecommends.byteDiskSize["ivf_flat"]
            ),
          },
        ]);
      }
    },
    // eslint-disable-next-line
    [
      vectors.value,
      dimensions.value,
      nlist.value,
      m.value,
      segmetFileSize.value,
    ]
  );

  return (
    <Layout t={t}>
      <Seo title={TITLE} lang={language} description={DESCRIPTION} />
      <main className={`${styles.pageContainer} ${styles.sizingToolContainer}`}>
        <section className={styles.header}>
          <Link to="/">
            <img src={sizingToolLogo} alt="sizing tool header" />
          </Link>
        </section>

        <section className={styles.content}>
          <div className={styles.leftSection}>
            <h2>Requirements</h2>

            <form action="" className={styles.form}>
              {/* Number of vectors */}
              <TextFiled
                isRequired={true}
                label="Number of vectors"
                value={vectors.value}
                helpMsg="must > 0"
                showError={vectors.showError}
                errorMsg={
                  <span>
                    Number of vectors should be an integer greater than 0
                  </span>
                }
                onChange={onVectorChange}
              />
              {/* Dimensions */}
              <TextFiled
                isRequired={true}
                label="Dimensions"
                value={dimensions.value}
                helpMsg="[0, 1073741824]"
                showError={dimensions.showError}
                errorMsg={
                  <span>
                    Dimensions should be an integer between [0, 1073741824]
                  </span>
                }
                onChange={onDimensionsChange}
              />

              {/* nlist */}
              <TextFiled
                label="nlist"
                value={nlist.value}
                helpMsg="[1, 65536]"
                showError={nlist.showError}
                errorMsg={
                  <span>nList should be an integer between [1, 65536]</span>
                }
                onChange={onNlistChange}
              />
              {/* M */}
              <TextFiled
                type="number"
                label="m"
                value={m.value}
                helpMsg=" "
                showError={m.showError}
                errorMsg={MHint}
                onChange={onMChange}
                onFocus={onMFocus}
                onBlur={onMBlur}
              />
              {/* Segment file size */}
              <TextFiled
                type="number"
                label="Segment file size"
                value={segmetFileSize.value}
                helpMsg="must > 0"
                showError={segmetFileSize.showError}
                errorMsg={
                  <span>
                    Size of segment file should be greater than 0 and less than
                    131072 MB
                  </span>
                }
                onChange={onFileSizeChange}
              />
            </form>
          </div>

          <div className={styles.rightSection}>
            <h2>Recommendation {vectors.value !== "" && getVectorTitle()}</h2>

            <div className={styles.tableWrapper}>
              <h2>Float</h2>
              <CustomTable data={firstTBody}>
                <TableColumn
                  prop="indexType"
                  label={
                    <a href="https://milvus.io/docs/index.md#CPU">Index Type</a>
                  }
                />
                <TableColumn prop="rowFileSize" label="Raw File Size" />
                <TableColumn prop="memorySize" label="Memory Size" />
                <TableColumn prop="stableDiskSize" label="Stable Disk Size" />
              </CustomTable>
            </div>

            <div className={styles.tableWrapper}>
              <h2>Bytes</h2>
              <CustomTable data={secondTBody}>
                <TableColumn
                  prop="indexType"
                  label={
                    <a href="https://milvus.io/docs/index.md#CPU">Index Type</a>
                  }
                />
                <TableColumn prop="rowFileSize" label="Raw File Size" />
                <TableColumn prop="memorySize" label="Memory Size" />
                <TableColumn prop="stableDiskSize" label="Stable Disk Size" />
              </CustomTable>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: { language: { eq: $language } }) {
      edges {
        node {
          data
          language
          ns
        }
      }
    }
  }
`;

export default SizingTool;
