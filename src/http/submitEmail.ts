import axios from 'axios';

const hubsportAxiosInstance = axios.create({
  timeout: 20000,
  baseURL:
    'https://app.hubspot.com/submissions/24054828/form/62189c92-f957-4834-9b90-596c8a00dff4/performance?redirectUrl=https%3A%2F%2Fapp.hubspot.com%2Fforms%2F24054828%3Fquery%3Dmilvus%2Bnew',
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
