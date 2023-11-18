import { jsonToQueryString } from 'src/@core/utils'
import { getRequest } from '../http'
import { API_URL } from '../api-url'

export const getLevel1API = params =>
  getRequest(`${API_URL.GET_LEVEL1}${params === undefined ? '' : jsonToQueryString(params)}`)

export const getLevel2API = params =>
  getRequest(`${API_URL.GET_LEVEL2}${params === undefined ? '' : jsonToQueryString(params)}`)

export const getAccountAPI = params =>
  getRequest(`${API_URL.GET_ACCOUNT}${params === undefined ? '' : jsonToQueryString(params)}`)

export const getVoucherTypeAPI = params =>
  getRequest(`${API_URL.GET_VOUCHER_TYPE}${params === undefined ? '' : jsonToQueryString(params)}`)

export const getCurrencyAPI = params =>
  getRequest(`${API_URL.GET_CURRENCY}${params === undefined ? '' : jsonToQueryString(params)}`)

export const getGLTransactionsAPI = params =>
  getRequest(`${API_URL.GET_GL_TRANSACTIONS}${params === undefined ? '' : jsonToQueryString(params)}`)

export const getDealsAPI = params =>
  getRequest(`${API_URL.GET_DEALS}${params === undefined ? '' : jsonToQueryString(params)}`)

export const getDeal1API = params =>
  getRequest(`${API_URL.GET_DEAL1}${params === undefined ? '' : jsonToQueryString(params)}`)

export const getDeal2API = params =>
  getRequest(`${API_URL.GET_DEAL2}${params === undefined ? '' : jsonToQueryString(params)}`)

//>>>>>>>>>>Reports<<<<<<<<<<//
export const getAccountTransactionsAPI = params =>
  getRequest(`${API_URL.GET_GL_ACCOUNT_TRANSACTIONS}${params === undefined ? '' : jsonToQueryString(params)}`)

export const getAccountBalanceAPI = params =>
  getRequest(`${API_URL.GET_GL_ACCOUNT_BALANCE}${params === undefined ? '' : jsonToQueryString(params)}`)

export const getAccountLedgerAPI = params =>
  getRequest(`${API_URL.GET_GL_ACCOUNT_LEDGER}${params === undefined ? '' : jsonToQueryString(params)}`)

export const getLedgerAPI = params =>
  getRequest(`${API_URL.GET_GL_LEDGER}${params === undefined ? '' : jsonToQueryString(params)}`)

export const getTrialBalanceAPI = params =>
  getRequest(`${API_URL.GET_GL_TRIAL_BALANCE}${params === undefined ? '' : jsonToQueryString(params)}`)

export const getOpenExchangeRatesAPI = params =>
  getRequest(`${API_URL.GET_OPEN_EXCHANGE_RATES}${params === undefined ? '' : jsonToQueryString(params)}`, {
    useBaseURL: false
  })
