import { getItemAPI, updateItemAPI, deleteItemAPI } from 'src/configs'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { API_URL } from 'src/configs'

export const getItem = createAsyncThunk(API_URL.GET_ITEM_MAST, async params => {
  const response = await getItemAPI(params)

  return response?.data
})

export const updateItem = createAsyncThunk(API_URL.UPDATE_ITEM_MAST, async (data, { dispatch, getState }) => {
  const postResponse = await updateItemAPI({ data })

  const response = await dispatch(getItem(getState().item.params))

  return postResponse !== undefined && response.payload
})

export const deleteItem = createAsyncThunk(API_URL.DELETE_ITEM_MAST, async (data, { dispatch, getState }) => {
  const postResponse = await deleteItemAPI(data)

  const response = await dispatch(getItem(getState().item.params))

  return postResponse !== undefined && response.payload
})

export const itemSlice = createSlice({
  name: 'item',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getItem.fulfilled, (state, action) => {
      state.data = action.payload?.items
      state.total = action.payload?.total
      state.params = action.payload?.params
      state.allData = action.payload?.items
    })
  }
})

export default itemSlice.reducer
