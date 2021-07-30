import { createSlice, createAsyncThunk, createSelector, SerializedError, ActionReducerMapBuilder } from '@reduxjs/toolkit'
import get from 'lodash/get'

export type FnReturningPromise = (params: any) => Promise<any>
export type FnReturningState = (state: any) => any
export type PromiseType<P extends Promise<any>> = P extends Promise<infer T> ? T : never

declare type NoInfer<T> = [T][T extends any ? 0 : never]

export interface SliceInitialStateGeneric<T extends Promise<any>> {
  value: PromiseType<T> | null,
  loading: boolean,
  error: SerializedError | null,
}

export interface CreateAsyncSlice<T extends FnReturningPromise, X extends FnReturningState> {
  sliceName: string,
  parentSlicesNames?: string[],
  extraReducers?: (builder: ActionReducerMapBuilder<NoInfer<SliceInitialStateGeneric<ReturnType<T>>>>, asyncThunk: any) => void,
  onStart?: (params: Parameters<T>['0'], thunkAPI: Parameters<Parameters<typeof createAsyncThunk>['1']>['1']) => void,
  onDone?: (params: Parameters<T>['0'], thunkAPI: Parameters<Parameters<typeof createAsyncThunk>['1']>['1']) => void,
  onRejected?: (params: Parameters<T>['0'], error: any, thunkAPI: Parameters<Parameters<typeof createAsyncThunk>['1']>['1']) => void,
  onFulfilled?: (params: Parameters<T>['0'], thunkAPI: Parameters<Parameters<typeof createAsyncThunk>['1']>['1']) => void,
  fn: T,
  rootSelector?: X,
}

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T

export const createAsyncSlice = <T extends FnReturningPromise, X extends FnReturningState>(options: CreateAsyncSlice<T, X>) => {
  const {
    sliceName,
    parentSlicesNames = [],
    extraReducers,
    onStart,
    onDone,
    onRejected,
    onFulfilled,
    fn,
    rootSelector = (state) => state,
  } = options

  const asyncThunk = createAsyncThunk<ThenArg<ReturnType<T>>, Parameters<T>['0']>(
    `${parentSlicesNames.join('/')}/${sliceName}`,
    async (params, thunkAPI) => {
      onStart && onStart(params, thunkAPI)
      let response
      try {
        response = await fn(params)
        onFulfilled && onFulfilled(params, thunkAPI)
      } catch (error) {
        onRejected && onRejected(params, error, thunkAPI)
        throw error
      } finally {
        onDone && onDone(params, thunkAPI)
      }
      return response
    }
  )

  const selector = createSelector<ReturnType<X>, ReturnType<X>, SliceInitialState>(
    rootSelector,
    (state) => get(state, parentSlicesNames.concat(sliceName))
  )

  type SliceInitialState = SliceInitialStateGeneric<ReturnType<T>>

  const initialState: SliceInitialState = {
    value: null,
    loading: false,
    error: null,
  }

  const slice = createSlice({
    name: `${parentSlicesNames.join('/')}/${sliceName}`,
    initialState,
    reducers: {
      reset: (state) => {
        state.value = initialState.value
        state.loading = initialState.loading
        state.error = initialState.error
      },
    },
    extraReducers: (builder) => {
      builder.addCase(asyncThunk.pending, (state, action) => {
        state.loading = true
        state.error = null
      })
      builder.addCase(asyncThunk.fulfilled, (state, action) => {
        // @ts-ignore
        state.value = action.payload
        state.loading = false
        state.error = null
      })
      builder.addCase(asyncThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.error
      })
      if(extraReducers){
        if(typeof extraReducers === 'function'){
          extraReducers(builder, asyncThunk)
        }
      }
    },
  })

  return {
    slice,
    asyncThunk,
    selector,
    reset: slice.actions.reset,
  }
}

export default createAsyncSlice
