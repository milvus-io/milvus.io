import React, { useEffect, useRef } from 'react';
import * as styles from './index.module.less';
import { useMobileScreen } from '../../hooks';

const Swiper = ({ list, duration = 10000 }) => {
  const animateContainer = useRef(null);
  const { screenWidth } = useMobileScreen();
  console.log(screenWidth);

  useEffect(() => {
    const height =
      screenWidth > 1000
        ? 300
        : screenWidth <= 1000 && screenWidth > 375
        ? 400
        : 530;

    const len = list.length - 1;
    let [timer, index] = [null, 0];
    if (timer) {
      clearInterval(timer);
    }
    timer = setInterval(() => {
      index = index < len ? index + 1 : 0;
      animateContainer.current.style.transform = `translateY(${-(
        index * height
      )}px)`;
    }, duration);

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [screenWidth]);

  return (
    <div className={styles.swiperContainer}>
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
