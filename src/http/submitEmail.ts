import axios from 'axios';

const hubsportAxiosInstance = axios.create({
  timeout: 20000,
  baseURL:
    'https://api.hsforms.com/submissions/v3/integration/submit/24054828/0e47e016-7656-429c-838b-93445e4c5242',
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
