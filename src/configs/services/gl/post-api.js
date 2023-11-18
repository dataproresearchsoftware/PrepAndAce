import { postRequest } from '../http.js'
import { API_URL } from '../api-url.js'
import { jsonToQueryString } from 'src/@core/utils/custom-function.js'
import { deleteParams, updateParams } from '../constant.js'

//>>>>>>>>>>>Update<<<<<<<<<<<//
export const updateLevel1API = params => postRequest(API_URL.UPDATE_LEVEL1, updateParams(params))

export const updateLevel2API = params => postRequest(API_URL.UPDATE_LEVEL2, updateParams(params))

export const updateAccountAPI = params => postRequest(API_URL.UPDATE_ACCOUNT, updateParams(params))

export const updateVoucherTypeAPI = params => postRequest(API_URL.UPDATE_VOUCHER_TYPE, updateParams(params))

export const updateGLTransactionsAPI = params => postRequest(API_URL.UPDATE_GL_TRANSACTIONS, updateParams(params))

export const updateDealsAPI = params => postRequest(API_URL.UPDATE_DEALS, updateParams(params))

export const updateDeal1API = params => postRequest(API_URL.UPDATE_DEAL1, updateParams(params))

export const updateDeal2API = params => postRequest(API_URL.UPDATE_DEAL2, updateParams(params))

export const updateCurrencyAPI = params => postRequest(API_URL.UPDATE_CURRENCY, updateParams(params))

//>>>>>>>>>>>Delete<<<<<<<<<<<//
export const deleteLevel1API = params =>
  postRequest(`${API_URL.DELETE_LEVEL1}${jsonToQueryString(deleteParams(params))}`)

export const deleteLevel2API = params =>
  postRequest(`${API_URL.DELETE_LEVEL2}${jsonToQueryString(deleteParams(params))}`)

export const deleteAccountAPI = params =>
  postRequest(`${API_URL.DELETE_ACCOUNT}${jsonToQueryString(deleteParams(params))}`)

export const deleteVoucherTypeAPI = params =>
  postRequest(`${API_URL.DELETE_VOUCHER_TYPE}${jsonToQueryString(deleteParams(params))}`)

export const deleteGLTransactionsAPI = params =>
  postRequest(`${API_URL.DELETE_GL_TRANSACTIONS}${jsonToQueryString(deleteParams(params))}`)

export const deleteDealsAPI = params => postRequest(`${API_URL.DELETE_DEALS}${jsonToQueryString(deleteParams(params))}`)

export const deleteDeal1API = params => postRequest(`${API_URL.DELETE_DEAL1}${jsonToQueryString(deleteParams(params))}`)

export const deleteDeal2API = params => postRequest(`${API_URL.DELETE_DEAL2}${jsonToQueryString(deleteParams(params))}`)

export const deleteCurrencyAPI = params =>
  postRequest(`${API_URL.DELETE_CURRENCY}${jsonToQueryString(deleteParams(params))}`)
