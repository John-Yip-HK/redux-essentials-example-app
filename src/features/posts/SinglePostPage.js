import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { PostAuthor } from './PostAuthor'
import { TimeAgo } from './TimeAgo'
import { ReactionButtons } from './ReactionButtons'
import { selectPostById } from './postsSlice'

// match object contains the URL information we're looking for.
const SinglePostPage = ({ match }) => {
  const { postId } = match.params

  // The component will re-render any time the value returned from useSelector changes to a new reference.
  const post = useSelector((state) => selectPostById(state, postId))

  return (
    <section>
      {!post ? (
        <section>
          <h2>Post not found!</h2>
        </section>
      ) : (
        <section>
          <article className="post">
            <h2>{post.title}</h2>
            <p className="post-content">{post.content}</p>
            <div>
              <PostAuthor userId={post.userId} />
              <TimeAgo timestamp={post.date} />
            </div>
            <ReactionButtons post={post} />
            <Link to={`/editPost/${postId}`} className="button">
              Edit Post
            </Link>
          </article>
        </section>
      )}
    </section>
  )
}

export default SinglePostPage
