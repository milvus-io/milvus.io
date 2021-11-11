import React from 'react';
import { Box, Image } from 'gestalt';
import PreviewItem from './PreviewItem';
import blackSearch from '../../../images/milvus-demos/search-black.svg';
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
        draggable="true"
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
