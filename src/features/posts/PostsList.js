import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { PostAuthor } from './PostAuthor'
import { ReactionButtons } from './ReactionButtons'
import { TimeAgo } from './TimeAgo'
import {
  selectAllPosts,
  fetchPosts,
  selectPostIds,
  selectPostById,
} from './postsSlice'
import { Spinner } from '../../components/Spinner'
// All of the code related to our feed posts feature should go in the posts folder

// The useGetPostsQuery replaces all of useSelector, useDispatch and useEffect in one go!
import { useGetPostsQuery } from '../api/apiSlice'

// We can directly pass a post into the PostExcerpt element now.
let PostExcerpt = ({ post }) => {
  return (
    <article className="post-excerpt" key={post.id}>
      <h3>{post.title}</h3>
      <div>
        <PostAuthor userId={post.user} />
        <TimeAgo timestamp={post.date} />
      </div>
      <p className="post-content">{post.content.substring(0, 100)}</p>

      <ReactionButtons post={post} />
      <Link to={`/posts/${post.id}`} className="button muted-button">
        View Post
      </Link>
    </article>
  )
}

// By using React.memo, it ensure that the component inside of it only re-renders if the props have actually changed
PostExcerpt = React.memo(PostExcerpt)

const PostsList = () => {
  /**
   * Structure of the useGetPostsQuery result:
   * 1. data: the actual response from the server. This field will be undefined until the result is received from the server.
   * 2. isLoading: a boolean value indicating if the hook is currently making the first request to the server.
   * 3. isFetching: a boolean indicating if the hook is currently making any request to the server.
   * 4. isSuccess: a boolean indicating if the hook has made a successful request and has cached data available (data should be defined now)
   * 5. isError: a boolean indicating if the last request had an error.
   * 6. error: a serialized error object
   */
  const {
    data: posts,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetPostsQuery()

  // const dispatch = useDispatch()
  // const orderedPosts = useSelector(selectPostIds)

  // const postStatus = useSelector((state) => state.posts.status)
  // const error = useSelector((state) => state.posts.error)

  // useEffect(() => {
  //   if (postStatus === 'idle') {
  //     dispatch(fetchPosts())
  //   }
  // }, [postStatus, dispatch])

  let content

  if (isLoading) {
    content = <Spinner text="loading..." />
  } else if (isSuccess) {
    content = posts.map((post) => <PostExcerpt key={post.id} post={post} />)
  } else if (isError) {
    content = <div>{error}</div>
  }

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {content}
    </section>
  )
}

export default PostsList
