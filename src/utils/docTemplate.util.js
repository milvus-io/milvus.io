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
    e => e.textContent === anchorText
  );
};

export const sortVersions = (a, b) => {
  const [v1, s1, m1] = a.split('.');
  const [v2, s2, m2] = b.split('.');
  
  const aValue = v1.split('')[1] * 10000 + s1 * 100 + m1 * 1;
  const bValue = v2.split('')[1] * 10000 + s2 * 100 + m2 * 1;

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

export const importAllPics = (r, type, users = [], resources = []) => {
  r.keys().forEach(key => {
    const m = r(key);
    const matchs = key.match(/.\/(\S*).svg/);
    let href = '';
    let order = 0;
    if (type === 'resources' && matchs.length) {
      switch (matchs[1]) {
        case 'bilibili':
          order = 4;
          href =
            'https://space.bilibili.com/478166626?from=search&seid=1306120686699362786';
          break;
        case 'medium':
          order = 2;
          href = 'https://medium.com/unstructured-data-service';
          break;
        case 'slack':
          order = 0;
          href =
            'https://milvusio.slack.com/join/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ';
          break;
        case 'twitter':
          order = 1;
          href = 'https://twitter.com/milvusio';
          break;
        case 'zhihu':
          order = 5;
          href = 'https://zhuanlan.zhihu.com/ai-search';
          break;
        case 'wechat':
          order = 3;
          href = '#';
          break;
        default:
          href = '#';
          break;
      }
    }
    if (type === 'users') {
      const index = key.replace(/[^0-9]/gi, '');
      users[index] = m;
    } else {
      resources[order] = { src: m, name: matchs && matchs[1], href };
    }
  });
};
