// Import the RTK Query methods from the React-specific entry point
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define our single API slice object
// RTK Query functionality is based on the createApi method.
// Tags are used to define the relationships between queries and mutations to enable automatic data refetching.
// A tag = a string / small object letting you name certain types of data, and invalidate portions of the cache. When a cache tag is invalidated, RTK Query will automatically refetch the endpoints that were marked with that tag.
export const apiSlice = createApi({
  // The cache reducer expects to be added at `state.api` (already default - this is optional)
  // The expected top-level state slice field for the generated reducer.
  reducerPath: 'api',
  // All of our requests will have URLs starting with '/fakeApi'
  baseQuery: fetchBaseQuery({ baseUrl: '/fakeApi' }),
  // An array of string tag names for data types such as "Post".
  // Note that there's nothing special about the literal string 'Post' here. We could have called it 'Fred', 'qwerty', or anything else. It just needs to be the same string in each field, so that RTK Query knows "when this mutation happens, invalidate all endpoints that have that same tag string listed".
  tagTypes: ['Post'],
  // The "endpoints" represent operations and requests for this server.
  // It can be queries or mutations to the server.
  // Endpoint definitions are created with builder.query() or builder.mutation().
  endpoints: (builder) => ({
    // The `getPosts` endpoint is a "query" operation that returns data
    getPosts: builder.query({
      // The URL for the request is '/fakeApi/posts'
      // You can return an object to override the expected GET request like {url: '/posts', method: 'POST', body: newPost}.
      query: () => '/posts',
      providesTags: ['Post'], // For query endpoints. A set of tags describing the data in that query.
    }),
    // Get a single post based on post id.
    getPost: builder.query({
      query: (postId) => `/posts/${postId}`,
    }),
    addNewPost: builder.mutation({
      // Our query option now returns an object containing {url, method, body}.
      query: (initialPost) => ({
        url: '/posts',
        method: 'POST',
        // Include the entire post object as the body of the request. This object will be JSON-serialized automatically.
        body: initialPost,
      }),
      invalidatesTags: ['Post'], // For mutation endpoints. A set of tags that are invalidated every time that mutation runs.
    }),
  }),
})

// Export the auto-generated hook for the `getPosts` query endpoint (for every endpoint we define)
// Hook names are generated in this way: get[endpoint-name-first-letter-capitalized]Query.
// Remember endpoint hook only accepts one parameter. If need to pass multiple parameters, use an object instead. RTK will check fields in a "shallow stable" comparison to decide if a new fetch needs to be invoked.
export const { useGetPostsQuery, useGetPostQuery, useAddNewPostMutation } =
  apiSlice
