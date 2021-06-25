import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';

const AnimatedSvg = props => {
  const { data, className = '' } = props;
  const wrapperRef = useRef(null);

  useEffect(() => {
    const anime = lottie.loadAnimation({
      container: wrapperRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: data,
    });

    return () => {
      anime.stop();
      anime.destroy();
    };
  }, [data]);

  return <div className={className} ref={wrapperRef}></div>;
};

export default AnimatedSvg;
