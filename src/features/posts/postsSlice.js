import { createSlice, nanoid } from '@reduxjs/toolkit'

const initialState = [
  { id: '1', title: 'First Post!', content: 'Hello!' },
  { id: '2', title: 'Second Post', content: 'More text' },
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
      prepare: (title, content) => ({
        payload: {
          id: nanoid(),
          title,
          content,
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
  },
})

// When we write the postAdded reducer function, createSlice will automatically generate an "action creator" function with the same name.
// We can retrieve the action function in the 'actions' attribute of postSlice slice.
export const { postAdded, postUpdated } = postsSlice.actions

export default postsSlice.reducer
