import { createSlice, nanoid, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from '../../api/client'

const reactions = {
  thumbsUp: 0,
  hooray: 0,
  heart: 0,
  rocket: 0,
  eyes: 0,
}

const initialState = {
  posts: [],
  status: 'idle',
  error: null,
}

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

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // The "prepare callback" function can take multiple arguments, generate random values like unique IDs, and run whatever other synchronous logic is needed to decide what values go into the action object
    postAdded: {
      reducer: (state, action) => {
        state.posts.push(action.payload)
      },
      prepare: (title, content, userId) => ({
        payload: {
          id: nanoid(),
          date: new Date().toISOString(),
          title,
          content,
          userId,
          reactions,
        },
      }),
    },
    postUpdated: (state, action) => {
      const { id, title, content } = action.payload
      const postToBeEdited = state.posts.find((post) => post.id === id)

      if (postToBeEdited) {
        postToBeEdited.title = title
        postToBeEdited.content = content
      }
    },
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload
      const existingPost = state.posts.find((post) => post.id === postId)
      if (existingPost) {
        existingPost.reactions[reaction]++
      }
    },
  },
})

// Prevent from rewriting component every time we update the state format.
// Define our selector function inside our slice file.
// 'state' parameter = root Redux state object.
export const selectAllPosts = (state) => state.posts.posts
export const selectPostById = (state, postId) =>
  state.posts.posts.find((post) => post.id === postId)

// When we write the postAdded reducer function, createSlice will automatically generate an "action creator" function with the same name.
// We can retrieve the action function in the 'actions' attribute of postSlice slice.
export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions

export default postsSlice.reducer
