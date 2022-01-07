import axios from 'axios';

const axiosInstance = axios.create({
  timeout: 20000,
  baseURL: 'https://mservice.zilliz.com/',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
});

axiosInstance.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  response => {
    return Promise.resolve(response.data);
  },
  error => {
    return Promise.reject(error);
  }
);

// This interface requires Nginx proxy before it can be used
// Need to be packaged by docker to debug
export const submitInfoForm = async params => {
  return axiosInstance.post(`/mailchimp`, params);
};
