import axios from 'axios';
import { Octokit } from '@octokit/core';

console.log(process.env.NODE_ENV, 'api:', process.env.NEXT_PUBLIC_API_BASE_URL);

const userToken = `Z2hwX2ZYUWQwTVNBa3dudTB4UkJjWGhxNUZXVmZGYVdWWjIzQnVnSA==`;
const org = 'zilliz-bootcamp';
const repo = 'record_user_question';

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
  return axios.get('https://demos.zilliz.com/faq/search', config);
};

export const sendQuestion = ({ quest = '', email = '' }) => {
  let auth;
  if (atob) {
    auth = atob(userToken);
  }
  if (!quest || !email) {
    console.log('no email or question');
    return;
  }
  const octokit = new Octokit({
    auth,
  });
  octokit
    .request('POST /repos/{owner}/{repo}/issues', {
      owner: org,
      repo,
      title: quest,
      body: `user ${email} left a question: ${quest}`,
    })
    .then(res => {
      console.log('user submit question success', res);
    })
    .catch(err => {
      console.log('user submit question error', err);
    });
};

export default axiosInstance;
