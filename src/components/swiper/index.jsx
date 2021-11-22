import React, { useEffect, useState, useref, useRef } from 'react';
import * as styles from './index.module.less';

const Swiper = ({ list, direction = 'horizontal', duration = 10000 }) => {
  const animateContainer = useRef(null);

  useEffect(() => {
    const len = list.length - 1;
    let [timer, index] = [null, 0];
    if (timer) {
      clearInterval(timer);
    }
    timer = setInterval(() => {
      index = index < len ? index + 1 : 0;
      animateContainer.current.style.transform = `translateY(${-(
        index * 300
      )}px)`;
    }, duration);

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, []);

  return (
    <div className={styles.swiperContainer}>
      <ul
        className={styles.listWrapper}
        style={{
          flexDirection: `${direction === 'horizontal' ? 'row' : 'column'}`,
        }}
        ref={animateContainer}
      >
        {list.map((item, idx) => (
          <li className={`${styles.listItem}`} key={item.text}>
            <p className={styles.content}>{item.text}</p>
            <p className={styles.author}>{item.author}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Swiper;
