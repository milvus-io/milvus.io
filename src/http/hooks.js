import { useState, useEffect } from 'react';
import { getGithubCommits, getFaq } from './index';
import dayjs from 'dayjs';

export function useGithubCommits({ commitPath, version }) {
  const [commitInfo, setCommitInfo] = useState({
    message: '',
    date: '',
    commitUrl: '',
    source: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getGithubCommits(commitPath, version);
        if (res.status === 200 && res.data.length) {
          const lastCommit = res.data[0];
          const message = lastCommit.commit.message.split('\n')[0];
          const date = lastCommit.commit.committer.date;
          const commitUrl = lastCommit.html_url;
          const formatDate = dayjs(date).format('YYYY-MM-DD HH:mm:ss');
          const source = `https://github.com/milvus-io/milvus-docs/blob/${version}/${commitPath}`;
          setCommitInfo({ commitUrl, date: formatDate, source, message });
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [commitPath, version]);

  return commitInfo;
}

export function useGetFaq(relatedKey) {
  const [relatedQuestions, setRelatedQuestions] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getFaq({
          params: {
            question: relatedKey,
            version: 1,
          },
        });
        if (res?.data?.response) {
          setRelatedQuestions(res.data.response.slice(0, 6));
        }
      } catch (error) {
        setRelatedQuestions();
      }
    };
    if (relatedKey) {
      fetchData();
    } else {
      setRelatedQuestions();
    }
  }, [relatedKey]);

  return relatedQuestions;
}

export function getCurrentSize() {
  if (typeof window !== 'undefined') {
    const desktop1920 = window.matchMedia('(min-width: 1920px)');
    const desktop1440 = window.matchMedia('(min-width: 1439px)');
    const desktop1024 = window.matchMedia('(min-width: 1024px)');
    const desktop744 = window.matchMedia('(min-width: 744px)');

    if (desktop1920.matches) {
      return 'desktop1920';
    } else if (desktop1440.matches) {
      return 'desktop1440';
    } else if (desktop1024.matches) {
      return 'desktop1024';
    } else if (desktop744.matches) {
      return 'tablet';
    }
    return 'phone';
  }
  return '';
}

export function useWindowSize() {
  const [size, setSize] = useState(() => {
    return getCurrentSize();
  });

  useEffect(() => {
    const onResize = () => {
      const cur = getCurrentSize();
      setSize(cur);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  });

  useEffect(() => {
    const cur = getCurrentSize();
    setSize(cur);
  }, []);

  return size;
}
