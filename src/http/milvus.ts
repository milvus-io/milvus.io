import { Octokit } from '@octokit/core';
import axios from 'axios';

const OWNER = 'milvus-io';
const REPOSITORY = 'milvus';

export const getGithubCommits = async (path: string, version: string) => {
  const res = await axios.get(
    `https://api.github.com/repos/milvus-io/milvus-docs/commits?path=${path}&sha=${version}`
  );
  return res;
};

export const getGithubStatics = async () => {
  const auth = process.env.NEXT_PUBLIC_REPO_STATICS_KEY;
  const octokit = new Octokit({
    auth,
  });
  try {
    const res = await octokit.request('GET /repos/{owner}/{repo}', {
      owner: OWNER,
      repo: REPOSITORY,
    });
    return res.data;
  } catch (error) {
    console.log(error);
    return {
      forks_count: 0,
      stargazers_count: 0,
    };
  }
};

export const fetchMilvusReleases = async () => {
  const auth = process.env.NEXT_PUBLIC_REPO_STATICS_KEY;
  const octokit = new Octokit({
    auth,
  });
  try {
    const res = await octokit.request('GET /repos/{owner}/{repo}/releases', {
      owner: OWNER,
      repo: REPOSITORY,
    });
    const latestTag = res.data[0].tag_name;
    return latestTag;
  } catch (error) {
    console.log(error);
    return 'v2.5.14';
  }
};
