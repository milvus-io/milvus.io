import React, { useEffect, useRef } from 'react';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import * as styles from './index.module.less';

let timer = null;
const CroppeDemo = props => {
  const imgRef = useRef(null);
  const myCropper = useRef(null);
  const { propSend, src, className, imgClassName } = props;

  const handleImgLoaded = e => {
    let latestSrc = null;
    const cropper = new Cropper(imgRef.current, {
      viewMode: 3,
      autoCropArea: 0.98,
      crop() {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          handleSend(latestSrc);
          latestSrc = src;
        }, 1000);
      },
    });
    myCropper.current = cropper;
  };

  // update cropper img
  useEffect(() => {
    if (src && myCropper.current) {
      myCropper.current.destroy();
      myCropper.current.crop();
    }
  }, [src]);

  const handleSend = latestSrc => {
    const cropperInstance = myCropper.current;
    if (latestSrc !== src) {
      return;
    }
    cropperInstance.getCroppedCanvas().toBlob(
      blob => {
        propSend(blob);
      } /*, 'image/png' */
    );
  };

  return (
    <div className={styles.cropper}>
      <div className={className}>
        {src && (
          <img
            ref={imgRef}
            src={src}
            alt="test"
            className={imgClassName}
            draggable={false}
            onLoad={handleImgLoaded}
          ></img>
        )}

        {/* <button onClick={handleDownload}>download</button>
      <button onClick={handleSend}>send</button> */}
      </div>
    </div>
  );
};
export default CroppeDemo;
