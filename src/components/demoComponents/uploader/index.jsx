import React, { useRef } from 'react';
import * as styles from './index.module.less';
import Button from '../button';
import { getImgUrl } from '../../../utils/demo-helper';
import { FileDrop } from 'react-file-drop';
import Cropper from '../cropper';
import { useWindowSize } from '../../../http/hooks';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from '@fortawesome/free-brands-svg-icons';

const UploaderHeader = ({
  handleImgSearch,
  handleSelectedImg,
  toggleIsShowCode,
  selectedImg,
  count,
  duration,
}) => {
  const currentSize = useWindowSize();
  const isMobile = ["phone", "tablet", "desktop1024"].includes(currentSize);
  const inputRef = useRef(null);
  const uploadSection = useRef(null);

  const handleUploadImg = () => {
    inputRef.current.click();
  };

  const handleInputChange = async e => {
    const file = inputRef.current.files[0] || '';
    if (!file) {
      return;
    }

    const src = getImgUrl(file);
    handleSelectedImg(file, src);
    handleImgSearch(file, true);
    e.target.value = '';
  };

  const handleDrop = (files, event) => {
    event.preventDefault();
    uploadSection.current.classList.remove('drag-enter');
    if (!files[0]) {
      return;
    }
    const src = getImgUrl(files[0]);
    // setSelectedImg(files[0] ? src : "");

    handleSelectedImg(files[0], src);
    handleImgSearch(files[0], true);
  };

  const handlerDragEnter = e => {
    e.preventDefault();
    uploadSection.current.classList.add('drag-enter');
  };
  const handleDragLeave = e => {
    e.preventDefault();
    uploadSection.current.classList.remove('drag-enter');
  };

  return (
    <>
      {!selectedImg ? (
        <FileDrop
          onDragOver={handlerDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className={styles.uploadSection} ref={uploadSection}>
            <h4 className={styles.desc}>
              {isMobile ? 'Click ' : 'Drag or click '}‘Browse’ to upload an
              image to try milvus vector similarity search.
            </h4>
            <div className={styles.uploadBtnWrapper}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                type="file"
                ref={inputRef}
                onChange={handleInputChange}
              />
              <Button
                variant="contained"
                className={styles.uploadBtn}
                onClick={handleUploadImg}
              >
                Upload Image
              </Button>
            </div>
          </div>
        </FileDrop>
      ) : (
        <div className={styles.uploadedHeader}>
          <div className={styles.backgroundBlock}>
            <Cropper
              src={selectedImg}
              propSend={handleImgSearch}
              className={styles.cropImgWrapper}
              imgClassName={styles.cropImg}
              viewMode={3}
            ></Cropper>
          </div>

          <div className={styles.btnsWrapper}>
            {!isMobile ? (
              <>
                <div className={styles.uploadBtnWrapper}>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    type="file"
                    ref={inputRef}
                    onChange={handleInputChange}
                  />
                  <Button
                    variant="contained"
                    className={styles.uploadBtn}
                    onClick={handleUploadImg}
                  >
                    Upload Image
                  </Button>
                </div>
                <div className={styles.resultDesc}>
                  <p className={styles.text}>Search Result: {count}</p>
                  <p className={styles.text}>Duration: {duration}</p>
                </div>
                <div className={styles.iconWrapper}>
                  <Button
                    link="https://github.com/milvus-io/milvus"
                    className={styles.linkBtn}
                  >
                    <FontAwesomeIcon className={styles.global} icon={faGithub} />
                  </Button>
                  <Button
                    link="mailto:info@milvus.com"
                    className={styles.linkBtn}
                  >
                    <FontAwesomeIcon className={styles.global} icon={faEnvelope} />
                  </Button>

                  {/* <IconButton type="button" onClick={toggleIsShowCode}>
                          <img src={subtract} alt="subtract" />
                        </IconButton> */}
                </div>
              </>
            ) : (
              <>
                <div>
                  <div className={styles.resultDesc}>
                    <p className={styles.text}>Search Result: {count}</p>
                    <p className={styles.text}>Duration: {duration}</p>
                  </div>
                  <div className={styles.iconWrapper}>
                    <Button
                      link="https://github.com/milvus-io/milvus"
                    >
                      <FontAwesomeIcon className={styles.global} icon={faGithub} />
                    </Button>
                  </div>
                </div>
                <div className={styles.uploadBtnWrapper}>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    type="file"
                    ref={inputRef}
                    onChange={handleInputChange}
                  />
                  <Button
                    variant="contained"
                    className={styles.uploadBtn}
                    onClick={handleUploadImg}
                  >
                    Upload Image
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default UploaderHeader;
