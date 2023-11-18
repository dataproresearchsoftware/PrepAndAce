import { getAccountAPI, updateAccountAPI, deleteAccountAPI, API_URL } from 'src/configs'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const getAccount = createAsyncThunk(API_URL.GET_ACCOUNT, async params => {
  const response = await getAccountAPI(params)

  return response?.data
})

export const updateAccount = createAsyncThunk(API_URL.UPDATE_ACCOUNT, async (data, { dispatch, getState }) => {
  const postResponse = await updateAccountAPI({ data })

  const response = await dispatch(getAccount(getState().account.params))

  return postResponse !== undefined && response.payload
})

export const deleteAccount = createAsyncThunk(API_URL.DELETE_ACCOUNT, async (data, { dispatch, getState }) => {
  const postResponse = await deleteAccountAPI({ acode: data.acode })

  const response = await dispatch(getAccount(getState().account.params))

  return postResponse !== undefined && response.payload
})

export const accountSlice = createSlice({
  name: 'account',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getAccount.fulfilled, (state, action) => {
      state.data = action.payload?.items
      state.total = action.payload?.total
      state.params = action.payload?.params
      state.allData = action.payload?.items
    })
  }
})

export default accountSlice.reducer
