import { configureStore, combineReducers } from '@reduxjs/toolkit'

import { createAsyncSlice } from './createAsyncSlice'

const REQUEST_FUNCTION_PASSING_MOCK = async (
  { param1, param2 }: { param1: string, param2: string }
) => {
  return {
    results: [],
    param1,
    param2,
  }
}

const REQUEST_FUNCTION_FAILING_MOCK = async (
  { param1 }: { param1: string, param2: string }
) => {
  throw new Error(`Entity with id ${param1} not found`)
}

const INITIAL_STATE = {
  value: null,
  loading: false,
  error: null,
}

describe('createAsyncSlice tests', () => {

  const {
    slice: testPassingSlice,
    asyncThunk: testPassingThunk,
    selector: testPassingSelector,
    reset: testPassingReset,
  } = createAsyncSlice({
    sliceName: 'passing',
    parentSlicesNames: ['testParent'],
    fn: REQUEST_FUNCTION_PASSING_MOCK,
  })
  const passingReducer = testPassingSlice.reducer

  const {
    slice: testFailingSlice,
    asyncThunk: testFailingThunk,
    selector: testFailingSelector,
    reset: testFailingReset,
  } = createAsyncSlice({
    sliceName: 'failing',
    parentSlicesNames: ['testParent'],
    fn: REQUEST_FUNCTION_FAILING_MOCK,
  })
  const failingReducer = testFailingSlice.reducer

  const parentReducer = combineReducers({
    passing: passingReducer,
    failing: failingReducer,
  })

  const mockStore = configureStore({
    reducer: {
      testParent: parentReducer,
    },
  })

  describe('defaults and initial state', () => {

    it('should return a slice', () => {

      expect(testPassingSlice.name).toBeDefined()
      expect(testPassingSlice.reducer).toBeDefined()
      expect(testPassingSlice.actions).toBeDefined()
      expect(testPassingSlice.caseReducers).toBeDefined()

    })

    it('should return a thunk', () => {

      expect(testPassingThunk).toBeDefined()
      expect(testPassingThunk.fulfilled).toBeDefined()
      expect(testPassingThunk.rejected).toBeDefined()
      expect(testPassingThunk.pending).toBeDefined()

    })

    it('should return a selector', () => {

      expect(testPassingSelector).toBeDefined()

    })

    it('reducer should return valid initial state', () => {

      const initialState = passingReducer(undefined, { type: '@@INIT' })

      expect(initialState).toStrictEqual({
        value: null,
        loading: false,
        error: null,
      })

    })

    it('selector should return a valid initial state', () => {

      const rootState = {
        testParent: {
          passing: INITIAL_STATE,
          failing: INITIAL_STATE,
        },
      }

      expect(testPassingSelector(rootState)).toStrictEqual(INITIAL_STATE)
      expect(testFailingSelector(rootState)).toStrictEqual(INITIAL_STATE)

    })

  })

  describe('passing promise', () => {

    it('should add loading state when promise is pending', () => {

      const newState = passingReducer(INITIAL_STATE, testPassingThunk.pending)
      expect(newState).toStrictEqual({
        ...INITIAL_STATE,
        loading: true,
      })

    })

    it('should remove loading state when promise is fulfilled', () => {

      const newState = passingReducer(
        {
          ...INITIAL_STATE,
          loading: true,
        },
        testPassingThunk.fulfilled
      )
      expect(newState.loading).toBe(false)

    })

    it('should set the value from the `fulfilled` action', () => {

      const RETURN_VALUE = 'FULFILLED'

      const newState = passingReducer(
        {
          ...INITIAL_STATE,
          loading: true,
        },
        {
          type: testPassingThunk.fulfilled,
          payload: 'FULFILLED',
        }
      )
      expect(newState.value).toBe(RETURN_VALUE)

    })

    it('should set the value from the request', async () => {
      expect.assertions(1)

      await mockStore.dispatch(testPassingThunk({ param1: 'PARAM1', param2: 'PARAM2' }))

      const state = mockStore.getState()

      expect(state.testParent.passing).toStrictEqual({
        loading: false,
        error: null,
        value: {
          results: [],
          param1: 'PARAM1',
          param2: 'PARAM2',
        },
      })
    })

  })

  describe('rejecting promise', () => {

    it('should set error from the request', async () => {

      expect.assertions(3)

      await mockStore.dispatch(testFailingThunk({ param1: 'PARAM1', param2: 'PARAM2' }))

      const state = mockStore.getState()

      expect(state.testParent.failing.error?.message).toBe('Entity with id PARAM1 not found')
      expect(state.testParent.failing.loading).toBe(false)
      expect(state.testParent.failing.value).toBe(null)

    })

  })

  describe('resetting state', () => {

    it('passing', async () => {

      expect.assertions(3)

      await mockStore.dispatch(testPassingReset())

      const state = mockStore.getState()

      expect(state.testParent.passing.error).toBe(null)
      expect(state.testParent.passing.loading).toBe(false)
      expect(state.testParent.passing.value).toBe(null)

    })

    it('failing', async () => {

      expect.assertions(3)

      await mockStore.dispatch(testFailingReset())

      const state = mockStore.getState()

      expect(state.testParent.failing.error).toBe(null)
      expect(state.testParent.failing.loading).toBe(false)
      expect(state.testParent.failing.value).toBe(null)

    })

  })

})
