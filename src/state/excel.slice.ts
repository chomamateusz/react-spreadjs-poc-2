import { combineReducers } from '@reduxjs/toolkit'
import { createAsyncSlice } from '../utils/createAsyncSlice'

import { saveJSON } from '../api/saveJSON'
import { loadJSON } from '../api/loadJSON'

const parentSlicesNames = ['excel']

export const {
  slice: loadJSONSlice,
  asyncThunk: loadJSONThunk,
  selector: loadJSONSelector,
  reset: loadJSONReset,
} = createAsyncSlice({
  sliceName: 'loadJSON',
  parentSlicesNames,
  fn: loadJSON,
})

export const {
  slice: saveJSONSlice,
  asyncThunk: saveJSONThunk,
  selector: saveJSONSelector,
  reset: saveJSONReset,
} = createAsyncSlice({
  sliceName: 'saveJSON',
  parentSlicesNames,
  fn: saveJSON,
})

export const excelReducer = combineReducers({
  saveJSON: saveJSONSlice.reducer,
  loadJSON: loadJSONSlice.reducer,
})
