import axios from 'axios';

let hasError = false;

const baseURL = 'https://demos.zilliz.com';

const instance = axios.create({
  baseURL,
  timeout: 20000,
  headers: {
    'Content-Type': 'applycation/json',
  },
});

instance.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  res => {
    if (res.data && res.data.code === 400) {
      // openSnackBar(res.data.data.msg, "error", 2000);
      return res;
    }
    return res;
  },
  error => {
    if (hasError) {
      return Promise.reject(error);
    }
    if (error.response && error.response.data) {
      const { message: errMsg } = error.response.data;
      // errMsg && openSnackBar(errMsg, "error", 2000);
      hasError = true;
      setTimeout(() => {
        hasError = false;
      }, 2000);
      return Promise.reject(errMsg);
    }
    if (error.message) {
      hasError = true;
      setTimeout(() => {
        hasError = false;
      }, 2000);
      // openSnackBar(error.message, "error", 2000);
    }
    return Promise.reject(error);
  }
);

export const search = async (formData, isCn = false) => {
  const url = `${isCn ? 'cn' : 'en'}_img_serh/api/v1/search`;
  const res = await instance.post(url, formData);
  return res.data;
};

export const getCount = async isCn => {
  const url = `${isCn ? 'cn' : 'en'}_img_serh/api/v1/count`;
  const res = await instance.post(url);
  return res.data;
};
