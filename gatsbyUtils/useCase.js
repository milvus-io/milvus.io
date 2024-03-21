const axios = require('axios');

const cmsUrl = process.env.MSERVICE_URL;

const fetchUseCases = async () => {
  try {
    const response = await axios.get('https://cms.zilliz.cc/milvus-use-cases');
    const result = response.data[0].use_case_list.map(v => ({
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
