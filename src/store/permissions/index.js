import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { decUserData } from 'src/@core/utils'

// ** Axios Imports
import { axios } from 'src/configs'
import { API_URL } from 'src/configs'

// ** Fetch Users
export const fetchPermissions = createAsyncThunk('permissions', async params => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_BASEURL_LOCAL}api/per?path=${params.page}`)

  return response.data[0]
})

export default fetchPermissions
