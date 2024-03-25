const axios = require('axios');
const cmsUrl = process.env.MSERVICE_URL;

const fetchCustomers = async () => {
  try {
    const response = await axios.get(`${cmsUrl}/customer-stories`);
    const result = response.data.map(v => {
      return {
        name: v.customer_name,
        logo: v.home_page_logo.url,
      };
    });
    return result;
  } catch (error) {
    console.log('error--', error);
    return [];
  }
};

const fetchUseCases = async () => {
  try {
    const response = await axios.get(`${cmsUrl}/milvus-use-cases`);

    const result = response.data[0].use_case_list.map(v => {
      return {
        ...v,
        logo: v.logo?.url,
      };
    });
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
