export const deepClone = origin => {
  const getType = Object.prototype.toString;
  const arrayType = '[object Array]';

  let result = getType.call(origin) === arrayType ? [] : {};

  for (let p in origin) {
    if (origin[p] !== null && typeof origin[p] === 'object') {
      result[p] = deepClone(origin[p]);
    } else {
      result[p] = origin[p];
    }
  }
  return result;
};

export const debounce = (fn, delay) => {
  let timer = null;
  return function () {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(fn, delay);
  };
};

export const splitList = (list, n) => {
  const temp = deepClone(list);
  const result = [];

  while (temp.length >= n) {
    result.push(temp.splice(0, n));
  }
  result.push(temp);
  return result;
};
