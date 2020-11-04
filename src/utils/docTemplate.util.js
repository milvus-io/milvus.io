export const scrollToElement = (element, offset = 62) => {
  // const offset = 62;
  const bodyRect = document.body.getBoundingClientRect().top;
  const elementRect = element.getBoundingClientRect().top;

  const elementPosition = elementRect - bodyRect;
  const offsetPosition = elementPosition - offset;

  window.scrollTo({
    top: offsetPosition,
  });
};

export const getAnchorElement = (selector, anchorText) => {
  return Array.from(document.querySelectorAll(selector)).find(
    (e) => e.textContent === anchorText
  );
};

export const sortVersions = (a, b) => {
  const [v1, s1, m1] = a.split('.');
  const [v2, s2, m2] = b.split('.');
  const aValue = v1.split('')[1] * 100 + s1 * 10 + m1 * 1;
  const bValue = v2.split('')[1] * 100 + s2 * 10 + m2 * 1;

  if (aValue > bValue) {
    return -1;
  }
  if (aValue === bValue) {
    return 0;
  }
  if (aValue < bValue) {
    return 1;
  }
};
