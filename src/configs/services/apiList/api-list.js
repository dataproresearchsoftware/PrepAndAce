import { jsonToQueryString } from 'src/@core/utils'
import { getRequest, postRequest } from '../http'
import { API_URL } from '../api-url'

export const getCountryAPI = params =>
  getRequest(`${API_URL.COUNTRY}${params === undefined ? '' : jsonToQueryString(params)}`, {
    config: { skipSetURL: true }
  })

export const getCityAPI = params =>
  getRequest(`${API_URL.CITY}${params === undefined ? '' : jsonToQueryString(params)}`, {
    config: { skipSetURL: true }
  })

export const getStudentRegistrationAPI = params =>
  getRequest(`${API_URL.REGISTRATION}${params === undefined ? '' : jsonToQueryString(params)}`, {
    config: { skipSetURL: true }
  })

export const getCourseListAPI = params =>
  getRequest(`${API_URL.COURSE_LIST}${params === undefined ? '' : jsonToQueryString(params)}`, {
    config: { skipSetURL: true }
  })

export const getCourseVideoDetailsAPI = params =>
  getRequest(`${API_URL.COURSE_VIDEO_DETAILS}${params === undefined ? '' : jsonToQueryString(params)}`, {
    config: { skipSetURL: true }
  })

// export const getCurrencyAPI = params =>
//   getRequest(`${API_URL.CURRENCY}`, {
//     config: { skipSetURL: true }
//   })

export const postStudentRegistrationAPI = params => postRequest(API_URL.REGISTRATION, params)

export const postUpdateSeenPointAPI = params => postRequest(API_URL.UPDATE_SEEN_POINT, params)

export const postVideoCompletedAPI = params => postRequest(API_URL.VIDEO_COMPLETED, params)
