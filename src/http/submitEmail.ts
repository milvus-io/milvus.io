import axios from 'axios';

const hubsportAxiosInstance = axios.create({
  timeout: 20000,
  baseURL:
    'https://api.hsforms.com/submissions/v3/integration/submit/24054828/62189c92-f957-4834-9b90-596c8a00dff4',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
});

// This interface requires Nginx proxy before it can be used
// Need to be packaged by docker to debug
export const submitHubspotForm = async (params: {
  email: string;
}): Promise<{ statusCode: number }> => {
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
