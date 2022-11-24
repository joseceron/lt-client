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

const del = async (token: string, nit: string): Promise<any> => {
  const url = `${API_PATHS.companies}/${nit}`

  return axios
    .delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }).then((response) => {
      console.log(response)
    }).catch((e) => {
      console.log(e)
    })
}

const update = async (body: any, token: string): Promise<any> => {
  const url = `${API_PATHS.companies}/${body.nit}`

  const headers = {
    Authorization: `Bearer ${token}`,
  }

  return axios
    .put(url, body, {headers}).then((response) => {
      console.log(response)
    }).catch((e) => {
      console.log(e)
    })
}

const create = async (body: any, token: string): Promise<any> => {
  const url = `${API_PATHS.companies}`

  const headers = {
    Authorization: `Bearer ${token}`,
  }

  return axios
    .post(url, body, {headers}).then((response) => {
      console.log(response)
    }).catch((e) => {
      console.log(e)
      throw e
    })
}



export const companyApi = {
  fetch,
  del,
  update,
  create
}