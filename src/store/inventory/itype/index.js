import { getItemTypeAPI, updateItemTypeAPI, deleteItemTypeAPI } from 'src/configs'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { API_URL } from 'src/configs'

export const getItemType = createAsyncThunk(API_URL.GET_ITEM_TYPE, async params => {
  const response = await getItemTypeAPI(params)

  return response?.data
})

export const updateItemType = createAsyncThunk(API_URL.UPDATE_ITEM_TYPE, async (data, { dispatch, getState }) => {
  const postResponse = await updateItemTypeAPI({ data })

  const response = await dispatch(getItemType(getState().itype.params))

  return postResponse !== undefined && response.payload
})

export const deleteItemType = createAsyncThunk(API_URL.DELETE_ITEM_TYPE, async (data, { dispatch, getState }) => {
  const postResponse = await deleteItemTypeAPI(data)
  const response = await dispatch(getItemType(getState().itype.params))

  return postResponse !== undefined && response.payload
})

export const itemTypeSlice = createSlice({
  name: 'itype',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getItemType.fulfilled, (state, action) => {
      state.data = action.payload?.items
      state.total = action.payload?.total
      state.params = action.payload?.params
      state.allData = action.payload?.items
    })
  }
})

export default itemTypeSlice.reducer
