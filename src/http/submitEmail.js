import axios from 'axios';

const axiosInstance = axios.create({
  timeout: 20000,
  baseURL: process.env.MSERVICE_URL || 'http://localhost:3000',
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

const portalId = `24054828`;
const formId = `62189c92-f957-4834-9b90-596c8a00dff4`;

const hubsportAxiosInstance = axios.create({
  timeout: 20000,
  baseURL: `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
});

// This interface requires Nginx proxy before it can be used
// Need to be packaged by docker to debug
export const submitHubspotForm = async params => {
  const data = {
    fields: [
      {
        name: 'email',
        value: params.email,
      },
    ],
  };

  return hubsportAxiosInstance.post('', data);
};
