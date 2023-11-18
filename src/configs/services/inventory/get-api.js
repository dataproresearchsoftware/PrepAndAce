import { jsonToQueryString } from 'src/@core/utils'
import { getRequest } from '../http'
import { API_URL } from '../api-url'

export const getItemTypeAPI = params => {
  return getRequest(`${API_URL.GET_ITEM_TYPE}${params === undefined ? '' : jsonToQueryString(params)}`)
}

export const getItemAPI = params => {
  return getRequest(`${API_URL.GET_ITEM_MAST}${params === undefined ? '' : jsonToQueryString(params)}`)
}

export const getPurchaseAPI = params =>
  getRequest(`${API_URL.GET_PURCHASE}${params === undefined ? '' : jsonToQueryString(params)}`)

export const getSalesAPI = params =>
  getRequest(`${API_URL.GET_SALES}${params === undefined ? '' : jsonToQueryString(params)}`)

export const getSupplierAPI = params =>
  getRequest(`${API_URL.GET_SUPPLIER}${params === undefined ? '' : jsonToQueryString(params)}`)

export const getCustomerAPI = params =>
  getRequest(`${API_URL.GET_CUSTOMER}${params === undefined ? '' : jsonToQueryString(params)}`)
