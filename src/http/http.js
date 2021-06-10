import axios from 'axios';

console.log(process.env.NODE_ENV, 'api:', process.env.NEXT_PUBLIC_API_BASE_URL);

const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}`,
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

export const getFaq = config => {
  return axios.get('http://demos.zilliz.com/faq/search', config);
};

export default axiosInstance;
