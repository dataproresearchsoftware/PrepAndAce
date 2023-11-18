import { getCustomerAPI, updateCustomerAPI, deleteCustomerAPI } from 'src/configs'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { API_URL } from 'src/configs'

export const getCustomer = createAsyncThunk(API_URL.GET_CUSTOMER, async params => {
  const response = await getCustomerAPI(params)

  return response?.data
})

export const updateCustomer = createAsyncThunk(API_URL.UPDATE_CUSTOMER, async (data, { dispatch, getState }) => {
  const postResponse = await updateCustomerAPI({ data })

  const response = await dispatch(getCustomer(getState().customer.params))

  return postResponse !== undefined && response.payload
})

export const deleteCustomer = createAsyncThunk(API_URL.DELETE_CUSTOMER, async (data, { dispatch, getState }) => {
  const postResponse = await deleteCustomerAPI(data)

  const response = await dispatch(getCustomer(getState().customer.params))

  return postResponse !== undefined && response.payload
})

export const CustomerSlice = createSlice({
  name: 'Customer',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getCustomer.fulfilled, (state, action) => {
      state.data = action.payload?.items
      state.total = action.payload?.total
      state.params = action.payload?.params
      state.allData = action.payload?.items
    })
  }
})

export default CustomerSlice.reducer
