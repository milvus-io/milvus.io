import axios from 'axios';
import { Octokit } from '@octokit/core';

const feedbackOrg = 'milvus-io';

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

export const getGithubCommits = async (path, version) => {
  const res = await axios.get(
    `https://api.github.com/repos/milvus-io/milvus-docs/commits?path=${path}&sha=${version}`
  );
  return res;
};

export const getGithubStatics = async () => {
  const auth = process.env.REPO_STATICS_KEY;
  const octokit = new Octokit({
    auth,
  });
  try {
    const res = await octokit.request('GET /repos/{owner}/{repo}', {
      owner: feedbackOrg,
      repo: 'milvus',
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export default axiosInstance;
