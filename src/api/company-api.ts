import axios from 'axios'

import { API_PATHS } from '@/constants/api-pahts'
import companyList from './companyList.json'

const fetch = async (token: string): Promise<any> => {
  return axios
    .get(`${API_PATHS.companies}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(res => res.data)
    .catch(e => {
      console.log(e)
      return companyList;      
    })
}

export const companyApi = {
  fetch
}