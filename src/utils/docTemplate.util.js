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
