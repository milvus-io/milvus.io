import * as styles from './index.module.less';
import Item from '../item/item';
import 'gestalt/dist/gestalt.css';
import clsx from 'clsx';
import { Masonry } from 'gestalt';

export default function CustomMasonry({
  images,
  loading,
  isSelected,
  isShowCode,
  onSearch,
  setModal,
  loadMore,
  scrollContainer,
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
        items={images}
        renderItem={data => (
          <Item
            data={data.data}
            isSelected={isSelected}
            onSearch={onSearch}
            setModal={setModal}
          />
        )}
        gutterWidth={16}
        layout="flexible"
        loadItems={loadMore}
        scrollContainer={scrollContainer}
        virtualize
      />
      {loading ? (
        <div className={styles.loadingTip}>Loading More...</div>
      ) : null}
    </div>
  );
}
