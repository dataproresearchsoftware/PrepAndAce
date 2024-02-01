import base_axios from 'axios'
import { toast } from 'react-hot-toast'
import { setURL } from './constant'

export const fileUploadAPI = base_axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_FILE_CRUD_LOCAL}api/files/upload/`
})

export const fileDeleteAPI = base_axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_FILE_CRUD_LOCAL}api/files/delete/`
})

export const fileReadUrl = `${process.env.NEXT_PUBLIC_FILE_CRUD_LOCAL}/files/`

let location = {}
if (typeof window !== 'undefined') {
  location = window.location
}

const P_URL = process.env.NEXT_PUBLIC_BASEURL_PUBLIC
const L_URL = process.env.NEXT_PUBLIC_BASEURL_LOCAL
let BASE_URL = L_URL

// if (P_URL.split('//')[1].substring(0, 3) === location?.hostname?.substring(0, 3)) {
//   BASE_URL = P_URL
// }

export const axios = base_axios.create({
  baseURL: `${BASE_URL}${process.env.NEXT_PUBLIC_ORDS_API_ENDPOINT}`
})

export const axios2 = base_axios.create({
  baseURL: `${location?.origin}/${process.env.NEXT_PUBLIC_CLIENT_API_ENDPOINT}`
})

export const getRequest = (url, { data = {}, config = { skipSetURL: false }, useBaseURL = true } = {}) => {
  const newUrl = config.skipSetURL ? url : setURL(url)
  if (useBaseURL) {
    return axios({
      method: 'get',
      url: newUrl,
      data,
      config
    })
      .then(response => {
        if (response?.data) {
          return response
        } else {
          toast.error(response.error)

          return response
        }
      })
      .catch(error => {
        toast.error(error.message)

        return error
      })
  } else {
    return base_axios(url, {
      method: 'get',
      data
    })
      .then(response => {
        if (response?.data) {
          return response
        } else {
          toast.error(response.error)

          return []
        }
      })
      .catch(error => {
        toast.error(error.message)
      })
  }
}

export const postRequest = (url, { data = {}, config = {} } = {}) => {
  return axios({
    method: 'post',
    url,
    data,
    config
  })
    .then(response => {
      if (config?.skipToast) {
      } else {
        if (response.data.message) {
          toast.success(response.data.message)
        } else {
          toast.error(response.data.error)
        }
      }

      return response
    })
    .catch(error => {
      toast.error(error.message)
    })
}
