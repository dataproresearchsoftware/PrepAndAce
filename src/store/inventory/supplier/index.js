import { getSupplierAPI, updateSupplierAPI, deleteSupplierAPI } from 'src/configs'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { API_URL } from 'src/configs'

export const getSupplier = createAsyncThunk(API_URL.GET_SUPPLIER, async params => {
  const response = await getSupplierAPI(params)

  return response?.data
})

export const updateSupplier = createAsyncThunk(API_URL.UPDATE_SUPPLIER, async (data, { dispatch, getState }) => {
  const postResponse = await updateSupplierAPI({ data })

  const response = await dispatch(getSupplier(getState().supplier.params))

  return postResponse !== undefined && response.payload
})

export const deleteSupplier = createAsyncThunk(API_URL.DELETE_SUPPLIER, async (data, { dispatch, getState }) => {
  const postResponse = await deleteSupplierAPI(data)

  const response = await dispatch(getSupplier(getState().supplier.params))

  return postResponse !== undefined && response.payload
})

export const supplierSlice = createSlice({
  name: 'supplier',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getSupplier.fulfilled, (state, action) => {
      state.data = action.payload?.items
      state.total = action.payload?.total
      state.params = action.payload?.params
      state.allData = action.payload?.items
    })
  }
})

export default supplierSlice.reducer
