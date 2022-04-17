// Import the RTK Query methods from the React-specific entry point
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define our single API slice object
// RTK Query functionality is based on the createApi method.
export const apiSlice = createApi({
  // The cache reducer expects to be added at `state.api` (already default - this is optional)
  // The expected top-level state slice field for the generated reducer.
  reducerPath: 'api',
  // All of our requests will have URLs starting with '/fakeApi'
  baseQuery: fetchBaseQuery({ baseUrl: '/fakeApi' }),
  // The "endpoints" represent operations and requests for this server.
  // It can be queries or mutations to the server.
  // Endpoint definitions are created with builder.query() or builder.mutation().
  endpoints: (builder) => ({
    // The `getPosts` endpoint is a "query" operation that returns data
    getPosts: builder.query({
      // The URL for the request is '/fakeApi/posts'
      // You can return an object to override the expected GET request like {url: '/posts', method: 'POST', body: newPost}.
      query: () => '/posts',
    }),
  }),
})

// Export the auto-generated hook for the `getPosts` query endpoint (for every endpoint we define)
export const { useGetPostsQuery } = apiSlice
