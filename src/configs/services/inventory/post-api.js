import { postRequest } from '../http.js'
import { API_URL } from '../api-url.js'
import { jsonToQueryString } from 'src/@core/utils/custom-function.js'
import { deleteParams, updateParams } from '../constant.js'

//>>>>>>>>>>>ITEM TYPE<<<<<<<<<<<//

export const updateItemTypeAPI = params => postRequest(API_URL.UPDATE_ITEM_TYPE, updateParams(params))

export const deleteItemTypeAPI = params =>
  postRequest(`${API_URL.DELETE_ITEM_TYPE}${jsonToQueryString(deleteParams(params))}`)

//>>>>>>>>>>>ITEM MAST<<<<<<<<<<<//

export const updateItemAPI = params => postRequest(API_URL.UPDATE_ITEM_MAST, updateParams(params))

export const deleteItemAPI = params =>
  postRequest(`${API_URL.DELETE_ITEM_MAST}${jsonToQueryString(deleteParams(params))}`)

//>>>>>>>>>>>PURCHASE<<<<<<<<<<<//
export const updatePurchaseAPI = params => postRequest(API_URL.UPDATE_PURCHASE, updateParams(params))

export const deletePurchaseAPI = params =>
  postRequest(`${API_URL.DELETE_PURCHASE}${jsonToQueryString(deleteParams(params))}`)

//>>>>>>>>>>>SUPPLIER<<<<<<<<<<<//

export const updateSupplierAPI = params => postRequest(API_URL.UPDATE_SUPPLIER, updateParams(params))

export const deleteSupplierAPI = params =>
  postRequest(`${API_URL.DELETE_SUPPLIER}${jsonToQueryString(deleteParams(params))}`)

//>>>>>>>>>>>SALES<<<<<<<<<<<//
export const updateSalesAPI = params => postRequest(API_URL.UPDATE_SALES, updateParams(params))

export const deleteSalesAPI = params => postRequest(`${API_URL.DELETE_SALES}${jsonToQueryString(deleteParams(params))}`)

//>>>>>>>>>>>CUSTOMER<<<<<<<<<<<//

export const updateCustomerAPI = params => postRequest(API_URL.UPDATE_CUSTOMER, updateParams(params))

export const deleteCustomerAPI = params =>
  postRequest(`${API_URL.DELETE_CUSTOMER}${jsonToQueryString(deleteParams(params))}`)
