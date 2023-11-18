//api/vertical-nav/data

import { createAsyncThunk } from '@reduxjs/toolkit'
import { decUserData } from 'src/@core/utils'

// ** Axios Imports
import { API_URL, axios } from 'src/configs'

// ** Fetch Users
export const fetchVerticalNav = createAsyncThunk('appUsers/fetchData', async params => {
  const userDetail = decUserData(window.localStorage.getItem('userData'))
  const { id, token } = JSON.parse(userDetail)

  const response = await axios.get(`${API_URL.NAVIGATION}?userid=${id}&token=${token}`)

  return response?.data.data
})

export default fetchVerticalNav
