import { getLevel1API, updateLevel1API, deleteLevel1API } from 'src/configs'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { API_URL } from 'src/configs'

export const getLevel1 = createAsyncThunk(API_URL.GET_LEVEL1, async params => {
  const response = await getLevel1API(params)

  return response?.data
})

export const updateLevel1 = createAsyncThunk(API_URL.UPDATE_LEVEL1, async (data, { dispatch, getState }) => {
  const postResponse = await updateLevel1API({ data })

  const response = await dispatch(getLevel1(getState().level1.params))

  return postResponse !== undefined && response.payload
})

export const deleteLevel1 = createAsyncThunk(API_URL.DELETE_LEVEL1, async (data, { dispatch, getState }) => {
  const postResponse = await deleteLevel1API({ l1code: data.l1code })

  const response = await dispatch(getLevel1(getState().level1.params))

  return postResponse !== undefined && response.payload
})

export const level1Slice = createSlice({
  name: 'level1',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getLevel1.fulfilled, (state, action) => {
      state.data = action.payload?.items
      state.total = action.payload?.total
      state.params = action.payload?.params
      state.allData = action.payload?.items
    })
  }
})

export default level1Slice.reducer
