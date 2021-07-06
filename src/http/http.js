import axios from 'axios';
import { Octokit } from '@octokit/core';

console.log(process.env.NODE_ENV, 'api:', process.env.NEXT_PUBLIC_API_BASE_URL);

const userToken = `Z2hwX2ZYUWQwTVNBa3dudTB4UkJjWGhxNUZXVmZGYVdWWjIzQnVnSA==`;
const org = 'zilliz-bootcamp';
const repo = 'record_user_question';

//'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';
const feedbackToken =
  'Z2hwX2VzcmU3cjkxZ0FaRlU5aGNndlhCOFBXcXMxc2N1dzFmTkJqNw==';
const feedbackOrg = 'milvus-io';
const feedbackRepo = 'milvus.io.feedback';

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

export const readStatisData = async () => {
  let auth;
  if (atob) {
    auth = atob(feedbackToken);
  }
  const octokit = new Octokit({
    auth,
  });

  try {
    const res = await octokit.request(
      'GET /repos/{owner}/{repo}/contents/{path}',
      {
        owner: feedbackOrg,
        repo: feedbackRepo,
        path: 'statistics/index.json',
      }
    );
    const { content, sha } = res.data;
    const { like, dislike } = JSON.parse(
      window.atob(content.replaceAll('\n', ''))
    );
    return {
      like,
      dislike,
      sha,
    };
  } catch (error) {
    console.log('error:', error);
  }
};

export const writeStatisData = async ({ sha, content, message }) => {
  let auth;
  if (atob) {
    auth = atob(feedbackToken);
  }
  const octokit = new Octokit({
    auth,
  });
  try {
    const { status } = await octokit.request(
      'PUT /repos/{owner}/{repo}/contents/{path}',
      {
        owner: feedbackOrg,
        repo: feedbackRepo,
        path: 'statistics/index.json',
        message,
        sha,
        content,
      }
    );
    if (status === 200) {
      console.log('score succesfully!');
    }
  } catch (error) {
    console.log('error:', error);
  }
};

export default axiosInstance;
