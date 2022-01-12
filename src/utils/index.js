export const sortVersions = (a, b) => {
  if (a && b) {
    let [v1, s1, m1] = a.split(".");
    let [v2, s2, m2] = b.split(".");

    // s1 m1 will be 'x' and undefined when version is v0.x or v1.x
    s1 = Number.isNaN(Number(s1)) ? 0 : s1;
    m1 = Number.isNaN(Number(m1)) ? 0 : m1;
    s2 = Number.isNaN(Number(s2)) ? 0 : s2;
    m2 = Number.isNaN(Number(m2)) ? 0 : m2;

    const aValue = v1.split("")[1] * 10000 + s1 * 100 + m1 * 1;
    const bValue = v2.split("")[1] * 10000 + s2 * 100 + m2 * 1;

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
