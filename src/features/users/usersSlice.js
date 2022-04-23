import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
} from '@reduxjs/toolkit'
import { apiSlice } from '../api/apiSlice'

const usersAdapter = createEntityAdapter()
const initialState = usersAdapter.getInitialState()

const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => '/users',
      transformResponse: (responseData) => {
        return usersAdapter.setAll(initialState, responseData)
      },
    }),
  }),
})

// We only export the getUsers endpoint only (alternative option).
export const getUsersEndpoint = apiSlice.endpoints.getUsers

// Calling `someEndpoint.select(someArg)` generates a new selector that will return
// the query result object for a query with those parameters.
// To generate a selector for a specific query argument, call `select(theQueryArg)`.
// In this case, the users query has no params, so we don't pass anything to select()
export const selectUsersResult = getUsersEndpoint.select()

export const { useGetUsersQuery } = extendedApiSlice

// selectUsersResult is a selector here.
export const selectUsersData = createSelector(
  selectUsersResult,
  (usersResult) => usersResult?.data
)

export const { selectAll: selectAllUsers, selectById: selectUserById } =
  usersAdapter.getSelectors((state) => selectUsersData(state) ?? initialState)
