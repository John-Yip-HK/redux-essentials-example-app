import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'

import postsReducer from '../features/posts/postsSlice'
import notificationsReducer from '../features/notifications/notificationsSlice'
import { apiSlice } from '../features/api/apiSlice'

export default configureStore({
  reducer: {
    posts: postsReducer,
    notifications: notificationsReducer,
    [apiSlice.reducerPath]: apiSlice.reducer, // reducerPath the that defined in our apiSlice.
  },
  // The apiSlice middleware manages cache lifetimes and expiration.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
})
