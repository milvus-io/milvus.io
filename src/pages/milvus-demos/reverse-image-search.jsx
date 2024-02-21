import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/layout/commonLayout';
import classes from '@/styles/imgSearch.module.less';
import pageClasses from '@/styles/responsive.module.less';
import clsx from 'clsx';
import { useState, useRef, useCallback } from 'react';
import { useWindowSize } from '@/http/hooks';
import { convertBase64UrlToBlob, getBase64Image } from '@/utils/demo-helper';
import CustomMasonry from '@/components/demoComponents/masonry';
import { search } from '@/http/imageSearch';
import UploaderHeader from '@/components/demoComponents/uploader';
import Modal from '@/components/demoComponents/modal';
import 'gestalt/dist/gestalt.css';
import FloatBoard from '@/components/demoComponents/floatBoard';
import Loading from '@/components/demoComponents/loading';
import { LeftArrow } from '@/components/githubButton/icons';
import { formatSearchResult } from '@/utils/imgSearch.utils';

const TITLE =
  'Milvus Reverse Image Search - Open-Source Vector Similarity Application Demo';
const DESC =
  'With Milvus, you can search by image in a few easy steps. Just click the “Upload Image” button and choose an image to see vector similarity search in action.';

export default function ReverseImageSearch() {
  const [searchResult, setSearchResult] = useState([]);
  const [pageIndex, setPagIndex] = useState(0);
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
  const currentSize = useWindowSize();
  const isMobile = ['phone', 'tablet'].includes(currentSize);
  const [modalConfig, setModalConfig] = useState({
    open: false,
    handleCloseModal: () => {},
    component: () => <></>,
  });
  const scrollContainerRef = useRef(null);

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

  const handleImgSearch = async (file, isReset = false, pageIdx) => {
    setLoading(true);
    setDuration('searching...');
    let tempPage = pageIndex;
    if (isReset) {
      setSearchResult([]);
      setPagIndex(0);
      tempPage = 0;
      setNoData(false);
    }
    const fd = new FormData();
    fd.append('file', file);
    fd.append('Num', `${window.innerWidth < 800 ? 16 : 50}`);
    fd.append('Page', `${pageIdx || tempPage}`);
    fd.append('Device', `${isMobile ? 1 : 0}`);

    try {
      const [res, duration = 0] = await search(fd, false);

      setDuration(`${Number.prototype.toFixed.call(duration * 1000, 2)} ms`);
      if (!res.length) {
        setNoData(true);
        return;
      }

      const formattedRes = await formatSearchResult(res);
      setSearchResult(v => [...v, ...formattedRes]);
    } catch (error) {
      console.log(error);
      setDuration('');
    } finally {
      setPagIndex(v => v + 1);
      setLoading(false);
    }
  };

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
  const handleSearch = useCallback(src => {
    handleImgToBlob(src, true);
    setSelected({
      src: src,
      isSelected: true,
    });
  }, []);

  const loadMoreImages = async () => {
    setPartialLoading(true);
    try {
      await handleImgSearch(file, false, pageIndex);
    } catch (error) {
      console.log(error);
    } finally {
      setPartialLoading(false);
    }
  };

  return (
    <main ref={scrollContainerRef} className={classes.outerContainer}>
      <Layout showFooter={false}>
        <Head>
          <title>{TITLE}</title>
          <meta name="description" content={DESC} />
        </Head>
        <div className={clsx(pageClasses.container, classes.pageContainer)}>
          <div className={classes.headerSection}>
            <Link href="/milvus-demos" className={classes.backButton}>
              <LeftArrow />
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

          <div className={classes.layoutSection}>
            {noData ? (
              <div className={classes.noDataTip}>No More Data.</div>
            ) : (
              <CustomMasonry
                images={searchResult}
                loading={partialLoading}
                isSelected={selected.isSelected}
                isShowCode={isShowCode}
                setModal={setModalConfig}
                onSearch={handleSearch}
                loadMore={loadMoreImages}
                scrollContainer={scrollContainerRef.current}
              />
            )}
          </div>
        </div>
      </Layout>
      {loading && !partialLoading ? <Loading /> : null}
      <Modal {...modalConfig} />
      <FloatBoard />
    </main>
  );
}
