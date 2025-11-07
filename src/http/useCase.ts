import axios from 'axios';
import { UseCaseType, FinalUserCaseType } from '../types/useCase';

const cmsUrl = process.env.NEXT_PUBLIC_CMS_BASE_URL;

const fetchCustomers = async () => {
  try {
    const response = await axios.get(`${cmsUrl}/customer-stories`);
    const result = response.data.map(v => {
      return {
        name: v.customer_name,
        logo: v.home_page_logo.url,
      };
    });
    return result;
  } catch (error) {
    console.log('error--', error);
    return [];
  }
};

export const fetchUseCases = async (): Promise<FinalUserCaseType[]> => {
  try {
    const response = await axios.get(`${cmsUrl}/milvus-use-cases`);

    const result = response.data[0].use_case_list.map((v: UseCaseType) => {
      return {
        ...v,
        logo: v.logo?.url,
      };
    });
    return result;
  } catch (error) {
    console.log('error--', error);
    return [];
  }
};
