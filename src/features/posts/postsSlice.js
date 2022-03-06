import { createSlice, nanoid } from '@reduxjs/toolkit'
import { sub } from 'date-fns'

const reactions = {
  thumbsUp: 0,
  hooray: 0,
  heart: 0,
  rocket: 0,
  eyes: 0,
}

const initialState = [
  {
    id: '1',
    title: 'First Post!',
    content: 'Hello!',
    date: sub(new Date(), { minutes: 10 }).toISOString(),
    reactions,
  },
  {
    id: '2',
    title: 'Second Post',
    content: 'More text',
    date: sub(new Date(), { minutes: 5 }).toISOString(),
    reactions,
  },
]

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // The "prepare callback" function can take multiple arguments, generate random values like unique IDs, and run whatever other synchronous logic is needed to decide what values go into the action object
    postAdded: {
      reducer: (state, action) => {
        state.push(action.payload)
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
      const postToBeEdited = state.find((post) => post.id === id)

      if (postToBeEdited) {
        postToBeEdited.title = title
        postToBeEdited.content = content
      }
    },
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload
      const existingPost = state.find((post) => post.id === postId)
      if (existingPost) {
        existingPost.reactions[reaction]++
      }
    },
  },
})

// Prevent from rewriting component every time we update the state format.
// Define our selector function inside our slice file.
// 'state' parameter = root Redux state object.
export const selectAllPosts = (state) => state.posts
export const selectPostById = (state, postId) =>
  state.posts.find((post) => post.id === postId)

// When we write the postAdded reducer function, createSlice will automatically generate an "action creator" function with the same name.
// We can retrieve the action function in the 'actions' attribute of postSlice slice.
export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions

export default postsSlice.reducer
