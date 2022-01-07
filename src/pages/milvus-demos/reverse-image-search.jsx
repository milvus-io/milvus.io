import React, { useState, useEffect, useCallback, useRef } from "react";
import Header from "../../components/header";
import Seo from "../../components/seo";
import {
  convertBase64UrlToBlob,
  getBase64Image,
} from "../../utils/demo-helper";
import Masonry from "../../components/demoComponents/masonry";
import { search } from "../../http/imageSearch";
import DemoImg from "../../images/demos/demo.jpg";
import UploaderHeader from "../../components/demoComponents/uploader";
import * as styles from "./demo.module.less";
import { Link, useI18next } from "gatsby-plugin-react-i18next";
import { graphql } from "gatsby";
import Modal from "../../components/demoComponents/modal";
import "gestalt/dist/gestalt.css";
import FloatBord from "../../components/demoComponents/floatBord";
import Loading from "../../components/demoComponents/loading";
import { useWindowSize } from "../../http/hooks";

const TITLE =
  "Milvus Reverse Image Search - Open-Source Vector Similarity Application Dem";
const DESC =
  "With Milvus, you can search by image in a few easy steps. Just click the “Upload Image” button and choose an image to see vector similarity search in action.";

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

const ImageSearchPage = ({ pageContext }) => {
  const [imgs, setImgs] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [partialLoading, setPartialLoading] = useState(false);
  const [selected, setSelected] = useState({
    src: "",
    isSelected: false,
  });
  const [duration, setDuration] = useState(0);
  const [file, setFile] = useState(null);
  const [isShowCode, setIsShowCode] = useState(false);
  const [noData, setNoData] = useState(false);
  const currentSize = useWindowSize();
  const isMobile = ["phone", "tablet"].includes(currentSize);
  const [modalConfig, setModalConfig] = useState({
    open: false,
    handleCloseModal: () => {},
    component: () => <></>,
  });

  const scrollContainer = useRef(null);

  const { locale } = pageContext;
  const { t } = useI18next();
  const formatImgData = async (list, setFunc) => {
    const results = list.map((item) => {
      const distance = item[1] ? item[1].toFixed(6) : 0;
      const src = item[0][0];
      const origin_src = src.replace(/pc_suo_|mobile_suo_/g, "");
      const [width, height] = item[0][1].split("X");
      return {
        distance,
        src,
        width: Number(width),
        height: Number(height),
        origin_src,
      };
    });
    setFunc((v) => [...v, ...results]);
  };

  const handleImgSearch = async (file, reset = false, scrollPage) => {
    setLoading(true);
    setDuration("searching...");
    let tempPage = page;
    if (reset) {
      setImgs([]);
      setPage(0);
      tempPage = 0;
      setNoData(false);
    }
    const fd = new FormData();
    fd.append("file", file);
    fd.append("Num", `${window.innerWidth < 800 ? 16 : 50}`);
    fd.append("Page", `${scrollPage || tempPage}`);
    fd.append("Device", `${isMobile ? 1 : 0}`);

    try {
      const [res, duration = 0] = await search(fd, false);
      setDuration(`${Number.prototype.toFixed.call(duration * 1000, 2)} ms`);
      if (!res.length) {
        setNoData(true);
        return;
      }

      formatImgData(res, setImgs);
    } catch (error) {
      console.log(error);
    } finally {
      setPage((v) => v + 1);
      setLoading(false);
    }
  };

  const handleImgToBlob = (src, reset = false) => {
    const image = document.createElement("img");
    image.crossOrigin = "";
    image.src = src;
    image.onload = function () {
      const base64 = getBase64Image(image);
      const imgBlob = convertBase64UrlToBlob(base64);
      handleImgSearch(imgBlob, reset);
      setFile(imgBlob);
    };
  };

  // reduce unnecessary rerendering
  const loadItems = useCallback(
    async () => {
      try {
        setPartialLoading(true);
        await handleImgSearch(file, false, page);
      } catch (error) {
        console.log(error);
      } finally {
        setPartialLoading(false);
      }
    },

    // eslint-disable-next-line
    [file, page]
  );

  const handleSelectedImg = (file, src) => {
    setFile(file);
    setSelected({
      src: src,
      isSelected: true,
    });
  };

  const toggleIsShowCode = () => {
    setIsShowCode((v) => !v);
    window.dispatchEvent(new Event("resize"));
  };

  // reduce unnecessary rerendering
  const handleSearch = useCallback(
    (src) => {
      handleImgToBlob(src, true);
      setSelected({
        src: src,
        isSelected: true,
      });
    },
    // eslint-disable-next-line
    []
  );

  // const handleGoBack = () => {
  //   window && (window.location.href = "/milvus-demos");
  // };

  useEffect(() => {
    handleImgToBlob(DemoImg);
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <Header t={t} darkMode={true} className={styles.demoHeader} />
      <Seo title={TITLE} lang={locale} description={DESC} />
      <main className={styles.root} ref={scrollContainer}>
        <div className={styles.searchPageContainer}>
          <div
            className={`${styles.contentContainer} ${
              isShowCode ? "shrink" : ""
            }`}
          >
            <div>
              <Link to="/milvus-demos" className={styles.backButton}>
                <i className="fas fa-chevron-left"></i>
                Back to Demo
              </Link>
              <UploaderHeader
                handleImgSearch={handleImgSearch}
                handleSelectedImg={handleSelectedImg}
                toggleIsShowCode={toggleIsShowCode}
                selectedImg={selected.src}
                duration={duration}
              />
            </div>

            <div className={styles.layoutSection}>
              {noData ? (
                <div className="no-data">
                  <p style={{ textAlign: "center" }}>No More Data.</p>
                </div>
              ) : (
                <Masonry
                  pins={imgs}
                  loadItems={loadItems}
                  loading={partialLoading}
                  isSelected={selected.isSelected}
                  isShowCode={isShowCode}
                  handleSearch={handleSearch}
                  setModal={setModalConfig}
                  scrollContainer={scrollContainer}
                />
              )}
            </div>
          </div>
          {isShowCode ? <div className={styles.codeContainer}>123</div> : null}
        </div>
        {loading && !partialLoading ? <Loading /> : null}
        <Modal {...modalConfig} />
        <FloatBord />
      </main>
    </>
  );
};

export default ImageSearchPage;
