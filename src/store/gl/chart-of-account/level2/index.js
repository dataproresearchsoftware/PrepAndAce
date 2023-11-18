import { getLevel2API, updateLevel2API, deleteLevel2API, API_URL } from 'src/configs'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const getLevel2 = createAsyncThunk(API_URL.GET_LEVEL2, async params => {
  const response = await getLevel2API(params)

  return response?.data
})

export const updateLevel2 = createAsyncThunk(API_URL.UPDATE_LEVEL2, async (data, { dispatch, getState }) => {
  const postResponse = await updateLevel2API({ data })

  const response = await dispatch(getLevel2(getState().level2.params))

  return postResponse !== undefined && response.payload
})

export const deleteLevel2 = createAsyncThunk(API_URL.DELETE_LEVEL2, async (data, { dispatch, getState }) => {
  const postResponse = await deleteLevel2API({ l1code: data.l1code, l2code: data.l2code })

  const response = await dispatch(getLevel2(getState().level2.params))

  return postResponse !== undefined && response.payload
})

export const level2Slice = createSlice({
  name: 'level2',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getLevel2.fulfilled, (state, action) => {
      state.data = action.payload?.items
      state.total = action.payload?.total
      state.params = action.payload?.params
      state.allData = action.payload?.items
    })
  }
})

export default level2Slice.reducer
