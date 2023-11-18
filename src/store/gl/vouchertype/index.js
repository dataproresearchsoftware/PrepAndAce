import { getVoucherTypeAPI, updateVoucherTypeAPI, deleteVoucherTypeAPI } from 'src/configs'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { API_URL } from 'src/configs'

export const getVoucherType = createAsyncThunk(API_URL.GET_VOUCHER_TYPE, async params => {
  const response = await getVoucherTypeAPI(params)

  return response?.data
})

export const updateVoucherType = createAsyncThunk(API_URL.UPDATE_VOUCHER_TYPE, async (data, { dispatch, getState }) => {
  const postResponse = await updateVoucherTypeAPI({ data })

  const response = await dispatch(getVoucherType(getState().voucherType.params))

  return postResponse !== undefined && response.payload
})

export const deleteVoucherType = createAsyncThunk(API_URL.DELETE_VOUCHER_TYPE, async (data, { dispatch, getState }) => {
  const postResponse = await deleteVoucherTypeAPI({ vcode: data.vcode })

  const response = await dispatch(getVoucherType(getState().voucherType.params))

  return postResponse !== undefined && response.payload
})

export const voucherTypeSlice = createSlice({
  name: 'voucherType',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getVoucherType.fulfilled, (state, action) => {
      state.data = action.payload?.items
      state.total = action.payload?.total
      state.params = action.payload?.params
      state.allData = action.payload?.items
    })
  }
})

export default voucherTypeSlice.reducer
