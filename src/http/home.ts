import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_MSERVICE_URL,
  timeout: 10000,
});

export const getMilvusStats = async (): Promise<{
  pipInstall: number;
  milvusStars: number;
}> => {
  const result = await axiosInstance.get('/milvus-stats');

  return {
    pipInstall: result.data.body?.pipInstall || 0,
    milvusStars: result.data.body?.milvusStars || 0,
  };
};
