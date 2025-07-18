import axios from 'axios';

console.log(process.env);

const axiosInstance = axios.create({
  baseURL: process.env.MSERVICE_URL || process.env.NEXT_PUBLIC_MSERVICE_URL,
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

axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  reject => {
    return Promise.reject(reject);
  }
);

export default axiosInstance;
