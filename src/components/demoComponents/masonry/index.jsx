import * as styles from './index.module.less';
import Item from '../item/item';
import clsx from 'clsx';
import Masonry from 'react-masonry-css';

export default function CustomMasonry({
  images,
  loading,
  isSelected,
  isShowCode,
  onSearch,
  setModal,
}) {
  return (
    <div
      className={clsx(styles.scrollContainer, {
        [styles.openCode]: isShowCode,
      })}
    >
      <div
        className={clsx(styles.toolTip, {
          [styles.open]: isSelected,
        })}
      >
        <p>Sorted by Similarity metric</p>
      </div>

      <Masonry
        breakpointCols={{
          default: 4,
          1200: 3,
          900: 2,
          600: 1,
        }}
        className={styles.masonryGrid}
        columnClassName={styles.masonryGridColumn}
      >
        {images.map((item, index) => (
          <Item
            key={index}
            data={item}
            isSelected={isSelected}
            onSearch={onSearch}
            setModal={setModal}
          />
        ))}
      </Masonry>
      {loading ? (
        <div className={styles.loadingTip}>Loading More...</div>
      ) : null}
    </div>
  );
}
