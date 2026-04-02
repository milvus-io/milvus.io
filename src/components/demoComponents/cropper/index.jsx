import React, { useEffect, useRef } from 'react';
import * as styles from './index.module.css';

let timer = null;
const CropperDemo = props => {
  const imgRef = useRef(null);
  const myCropper = useRef(null);
  const { propSend, src, className, imgClassName } = props;

  const handleImgLoaded = async e => {
    const [{ default: Cropper }, _] = await Promise.all([
      import('cropperjs'),
      import('cropperjs/dist/cropper.css'),
    ]);

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
        propSend(blob, true);
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
      </div>
    </div>
  );
};
export default CropperDemo;
