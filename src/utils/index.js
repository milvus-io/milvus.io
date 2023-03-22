const beta = [`beta`, `alpha`];
export const sortVersions = (a, b) => {
  if (a && b) {
    let [v1, s1, m1] = a.split('.');
    let [v2, s2, m2] = b.split('.');
    // eslint-disable-next-line
    let [_1, aBeta] = a.split('-');
    // eslint-disable-next-line
    let [_2, bBeta] = b.split('-');

    // s1 m1 will be 'x' and undefined when version is v0.x or v1.x
    s1 = Number.isNaN(Number(s1)) ? 0 : s1;
    m1 = Number.isNaN(Number(m1)) ? 0 : m1;
    s2 = Number.isNaN(Number(s2)) ? 0 : s2;
    m2 = Number.isNaN(Number(m2)) ? 0 : m2;

    aBeta = !beta.includes(aBeta) ? 0 : s1 * 100;
    bBeta = !beta.includes(bBeta) ? 0 : s2 * 100;

    const aValue = v1.split('')[1] * 10000 + s1 * 100 + m1 * 1 - aBeta;
    const bValue = v2.split('')[1] * 10000 + s2 * 100 + m2 * 1 - bBeta;

    if (aValue > bValue) {
      return -1;
    }
    if (aValue === bValue) {
      return 0;
    }
    if (aValue < bValue) {
      return 1;
    }
  }
};

export const findLatestVersion = allVersion => {
  return allVersion
    .map(a => a.version)
    .reduce((pre, cur) => {
      const curVersion = cur
        .substring(1)
        .split('.')
        .map(v => Number(v));
      const preVersion = pre
        .substring(1)
        .split('.')
        .map(v => Number(v));

      if (curVersion[0] !== preVersion[0]) {
        pre = curVersion[0] < preVersion[0] ? pre : cur;
      } else if (curVersion[1] !== preVersion[1]) {
        pre = curVersion[1] < preVersion[1] ? pre : cur;
      } else if (curVersion[2] !== preVersion[2]) {
        pre = curVersion[2] < preVersion[2] ? pre : cur;
      } else {
        pre = cur;
      }

      return pre;
    }, 'v0.0.0');
};
