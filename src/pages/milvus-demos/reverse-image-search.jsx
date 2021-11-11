import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from '../../components/header/v2';
import Seo from '../../components/seo';
import {
  convertBase64UrlToBlob,
  getBase64Image,
} from '../../utils/demo-helper';
import Masonry from '../../components/demoComponents/masonry';
import { search, getCount } from '../../utils/imageSearch';
import DemoImg from '../../images/milvus-demos/demo.jpg';
import UploaderHeader from '../../components/demoComponents/uploader';
import { useMobileScreen } from '../../hooks';
import * as styles from './index.module.less';
import Button from '../../components/button';
import Modal from '../../components/demoComponents/modal';
import 'gestalt/dist/gestalt.css';

const TITLE =
  'Milvus Reverse Image Search - Open-Source Vector Similarity Application Dem';
const DESC =
  'With Milvus, you can search by image in a few easy steps. Just click the “Upload Image” button and choose an image to see vector similarity search in action.';

const ImageSearchPage = ({ pageContext }) => {
  const [imgs, setImgs] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [partialLoading, setPartialLoading] = useState(false);
  const [selected, setSelected] = useState({
    src: '',
    isSelected: false,
  });
  const [duration, setDuration] = useState(0);
  const [file, setFile] = useState(null);
  const [isShowCode, setIsShowCode] = useState(false);
  const [noData, setNoData] = useState(false);
  const { isMobile } = useMobileScreen();
  const [modalConfig, setModalConfig] = useState({
    open: false,
    handleCloseModal: () => {},
    component: () => <></>,
  });

  const scrollContainer = useRef(null);

  const { locale } = pageContext;

  const formatImgData = async (list, setFunc) => {
    console.log(list);
    const results = list.map(item => {
      const distance = item[1] ? item[1].toFixed(6) : 0;
      const src = item[0][0];
      const origin_src = src.replace(/pc_suo_|mobile_suo_/g, '');
      const [width, height] = item[0][1].split('X');
      return {
        distance,
        src,
        width: Number(width),
        height: Number(height),
        origin_src,
      };
    });
    setFunc(v => [...v, ...results]);
  };

  const handleImgSearch = async (file, reset = false, scrollPage) => {
    setLoading(true);
    setDuration('searching...');
    let tempPage = page;
    if (reset) {
      setImgs([]);
      setPage(0);
      tempPage = 0;
      setNoData(false);
    }
    const fd = new FormData();
    fd.append('file', file);
    fd.append('Num', `${window.innerWidth < 800 ? 16 : 50}`);
    fd.append('Page', `${scrollPage || tempPage}`);
    fd.append('Device', `${isMobile ? 1 : 0}`);

    try {
      const [res, duration = 0] = await search(fd, false);
      setDuration(Number.prototype.toFixed.call(duration, 4));
      if (!res.length) {
        setNoData(true);
        return;
      }

      formatImgData(res, setImgs);
    } catch (error) {
      console.log(error);
    } finally {
      setPage(v => v + 1);
      setLoading(false);
    }
  };

  const handleImgToBlob = (src, reset = false) => {
    const image = document.createElement('img');
    image.crossOrigin = '';
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
    () => async () => {
      console.log('loading more');
      try {
        setPartialLoading(true);
        await handleImgSearch(file, false, page);
      } catch (error) {
        console.log(error);
      } finally {
        setPartialLoading(false);
      }
    },
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
    setIsShowCode(v => !v);
    window.dispatchEvent(new Event('resize'));
  };

  // reduce unnecessary rerendering
  const handleSearch = useCallback(
    () => src => {
      handleImgToBlob(src, true);
      setSelected({
        src: src,
        isSelected: true,
      });
    },
    []
  );

  const handleGoBack = () => {
    window && (window.location.href = '/milvus-demos');
  };

  useEffect(() => {
    handleImgToBlob(DemoImg);
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <Header locale={locale} showRobot={false} />
      <Seo title={TITLE} lang={locale} description={DESC} />
      <main className={styles.root} ref={scrollContainer}>
        <div className={styles.searchPageContainer}>
          <div
            className={`${styles.contentContainer} ${
              isShowCode ? 'shrink' : ''
            }`}
          >
            <div>
              <Button
                variant="text"
                className={styles.backButton}
                onClick={handleGoBack}
                children={
                  <>
                    <i className="fas fa-chevron-left"></i>
                    Back to Demo
                  </>
                }
              />
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
                  <p style={{ textAlign: 'center' }}>No More Data.</p>
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
        {loading && !partialLoading ? (
          <div className={styles.loadingWrapper}>loading...</div>
        ) : null}
        <Modal {...modalConfig} />
      </main>
    </>
  );
};

export default ImageSearchPage;
