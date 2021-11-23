import React, { useEffect, useRef } from 'react';
import * as styles from './index.module.less';
import { useMobileScreen } from '../../hooks';

const Swiper = ({ list, duration = 10000 }) => {
  const animateContainer = useRef(null);
  const wrapper = useRef(null);
  const { screenWidth } = useMobileScreen();

  useEffect(() => {
    const len = list.length - 1;
    const width = wrapper.current.clientWidth;
    let [timer, index] = [null, 0];
    if (timer) {
      clearInterval(timer);
    }
    timer = setInterval(() => {
      index = index < len ? index + 1 : 0;
      animateContainer.current.style.transform = `translateX(${-(
        index * width
      )}px)`;
    }, duration);

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [screenWidth]);

  return (
    <div className={styles.swiperContainer} ref={wrapper}>
      <ul className={styles.listWrapper} ref={animateContainer}>
        {list.map(item => (
          <li className={styles.listItem} key={item.text}>
            <p className={styles.content}>{item.text}</p>
            <p className={styles.author}>{item.author}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Swiper;
