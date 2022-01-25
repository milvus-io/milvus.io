import React from 'react';
import { Box, Image } from 'gestalt';
import PreviewItem from './previewItem';
import blackSearch from '../../../images/demos/search-black.svg';
import * as styles from './item.module.less';

const Item = props => {
  const {
    data: { height, width, src, distance, origin_src },
    isSelected,
    handleSearch,
    setModal,
  } = props;

  const closeCustomDialog = () => {
    setModal({
      open: false,
    });
  };

  const handlePreview = () => {
    setModal({
      open: true,
      component: () => (
        <PreviewItem
          src={origin_src}
          distance={distance}
          closeCustomDialog={closeCustomDialog}
          handleSearch={() => {
            handleSearch(src);
            closeCustomDialog();
          }}
        />
      ),
      handleCloseModal: closeCustomDialog,
    });
  };

  const searchThisPic = (e, src) => {
    e.stopPropagation();
    handleSearch(src);
  };

  return (
    <Box
      position="relative"
      className="ui-item"
      alignItems="center"
      // key={data.id}
      fit={true}
      padding={0}
    >
      <div
        className={styles.imgWrapper}
        onClick={handlePreview}
        onKeyDown={handlePreview}
        draggable="true"
        role="button"
        tabIndex="-1"
      >
        <Image
          alt="Test"
          color="#fff"
          naturalHeight={height}
          naturalWidth={width}
          src={src}
        />

        {/* <div className="icon-mask"> */}
        <span
          className={styles.iconWrapper}
          onClick={e => searchThisPic(e, src)}
          onKeyDown={e => searchThisPic(e, src)}
          role="button"
          tabIndex="-1"
        >
          <img src={blackSearch} alt="search-icon" />
        </span>
        {/* </div> */}
      </div>
      {isSelected ? (
        <div className={styles.textWrapper}>
          <p>Similarity Metirc:&nbsp;&nbsp;</p>
          <h5>{distance}</h5>
        </div>
      ) : null}
    </Box>
  );
};

export default Item;
