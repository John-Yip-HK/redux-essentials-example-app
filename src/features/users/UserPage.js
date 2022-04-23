import React, { useMemo } from 'react'
import { createSelector } from '@reduxjs/toolkit'

import { useGetPostsQuery } from '../api/apiSlice'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { selectUserById } from '../users/usersSlice'

export const UserPage = ({ match }) => {
  const { userId } = match.params

  const user = useSelector((state) => selectUserById(state, userId))

  // Our custom selector to ensure whatever data we extract is memoized correctly.
  // Normally, selectors expect the entire redux state as the first argument, but in this case we only concern about the cached result. Thus, the first argument here is the result.
  const selectPostsForUser = useMemo(() => {
    const emptyArray = []

    return createSelector(
      (res) => res.data,
      (res, userId) => userId,
      (data, userId) =>
        data?.filter((post) => post.user === userId) ?? emptyArray
    )
  })

  // Use the same posts query, but extract only part of its data
  const { postsForUser } = useGetPostsQuery(undefined, {
    // Use selectFromResult to have <UserPage> read just a filtered list of posts from the cache
    selectFromResult: (result) => ({
      ...result,
      postsForUser: selectPostsForUser(result, userId),
    }),
  })

  const postTitles = postsForUser.map((post) => (
    <li key={post.id}>
      <Link to={`/posts/${post.id}`}>{post.title}</Link>
    </li>
  ))

  return (
    <section>
      <h2>{user.name}</h2>

      <ul>{postTitles}</ul>
    </section>
  )
}
