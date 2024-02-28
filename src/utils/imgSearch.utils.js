export const formatSearchResult = async list => {
  const results = list.map(item => {
    const distance = item[1] ? item[1].toFixed(6) : 0;
    const src = item[0][0];
    const origin_src = src.replace(/pc_suo_|mobile_suo_/g, '');
    const [width, height] = item[0][1].split('X');
    return {
      distance,
      src,
      width: Number(width),
      height: Number(height),
      origin_src,
    };
  });
  return results;
};

export const throttle = (func, delay) => {
  let timeoutId;
  let lastExecTime = 0;

  return function (...args) {
    const currentTime = Date.now();

    if (currentTime - lastExecTime > delay) {
      clearTimeout(timeoutId);
      lastExecTime = currentTime;
      func.apply(this, args);
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        lastExecTime = currentTime;
        func.apply(this, args);
      }, delay);
    }
  };
};
