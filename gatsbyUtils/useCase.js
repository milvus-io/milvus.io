const axios = require('axios');

console.log('env--', process.env.NEXT_PUBLIC_API_BASE_URL);

const fetchUseCases = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:1337/milvus-use-cases');
    const result = response.data.map(v => ({
      ...v,
      logo: v.logo.url,
    }));
    return result;
  } catch (error) {
    console.log('error--', error);
    return [];
  }
};

const generateUseCasePages = (
  createPage,
  { template, newestVersion, versions, useCaseList }
) => {
  createPage({
    path: '/use-cases',
    component: template,
    ownerNodeId: 'use-case',
    context: {
      locale: 'en',
      newestVersion,
      versions,
      useCaseList,
    },
  });
};

module.exports = {
  generateUseCasePages,
  fetchUseCases,
};
