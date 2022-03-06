import {
  createSlice,
  createSelector,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit'
import { client } from '../../api/client'

const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
})

const initialState = postsAdapter.getInitialState({
  status: 'idle',
  error: null,
})

/**
 * createAsyncThunk accepts two arguments:

    A string that will be used as the prefix for the generated action types
    A "payload creator" callback function that should return a Promise containing some data, or a rejected Promise with an error

  The payload creator can either return a Promise directly, or data extracted from the Promise.
 */
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await client.get('/fakeApi/posts')
  return response.data
})

export const addNewPost = createAsyncThunk(
  'posts/addNewPost',
  async (initialPost) => {
    const response = await client.post('/fakeApi/posts', initialPost)
    return response.data
  }
)

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postUpdated: (state, action) => {
      const { id, title, content } = action.payload
      const postToBeEdited = state.entities[id]

      if (postToBeEdited) {
        postToBeEdited.title = title
        postToBeEdited.content = content
      }
    },
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload
      const existingPost = state.entities[postId]
      if (existingPost) {
        existingPost.reactions[reaction]++
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        postsAdapter.upsertMany(state, action.payload)
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(addNewPost.fulfilled, postsAdapter.addOne)
  },
})

export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
} = postsAdapter.getSelectors((state) => state.posts)
// The createSelector creates memoizes selectors that will only recalculate result when the inputs change.
// createSelector takes one or more "input selector" functions as argument, plus an "output selector" function. Whatever those input selectors return becomes the arguments for the output selector.
export const selectPostsByUser = createSelector(
  [selectAllPosts, (state, userId) => userId],
  (posts, userId) => posts.filter((post) => post.user === userId)
)

// When we write the postAdded reducer function, createSlice will automatically generate an "action creator" function with the same name.
// We can retrieve the action function in the 'actions' attribute of postSlice slice.
export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions

export default postsSlice.reducer
