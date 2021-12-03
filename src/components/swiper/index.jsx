import React, { useEffect, useRef, useState } from 'react';
import * as styles from './index.module.less';
import { useMobileScreen } from '../../hooks';

const Swiper = ({ list, duration = 10000 }) => {
  const wrapper = useRef(null);
  const { screenWidth } = useMobileScreen();
  const [activeIndex, setActiveIndex] = useState(0);

  const getArrItem = (list, index) => {
    if (index < 0) {
      return getArrItem(list, index + list.length);
    }
    return list[index];
  };

  // need to hide the item that is moved from the far left to the far right,
  // because it will overlap when it moves through the window.
  const getHiddenItem = (activeIndex, currentIndex) => {
    let temp =
      activeIndex - 2 < 0 ? activeIndex - 2 + list.length : activeIndex - 2;
    if (temp === currentIndex) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    const [len, width] = [list.length - 1, wrapper.current.clientWidth];
    let [timer, nextIndex] = [null, 0];
    const swiperItemList = Array.from(
      document.querySelectorAll('.swiper-item')
    );

    // generate circular track
    const loopArr = Array.from({ length: list.length }).map((_, i) => {
      if (i === list.length - 1) {
        return -1 * width;
      }
      return i * width;
    });

    if (timer) {
      clearInterval(timer);
    }

    timer = setInterval(() => {
      nextIndex = nextIndex < len ? nextIndex + 1 : 0;
      setActiveIndex(nextIndex);

      swiperItemList.forEach((item, idx) => {
        item.style.left = `${getArrItem(loopArr, idx - nextIndex)}px`;
      });
    }, duration);

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [screenWidth]);

  return (
    <div className={styles.swiperContainer} ref={wrapper}>
      {list.map((item, index) => (
        <div
          className={`${styles.swiperItem} ${
            getHiddenItem(activeIndex, index) ? styles.hidden : ''
          } swiper-item`}
          key={item.text}
          style={{ left: `${100 * index}%` }}
        >
          <p className={styles.content}>{item.text}</p>
          <p className={styles.author}>{item.author}</p>
        </div>
      ))}
    </div>
  );
};

export default Swiper;
