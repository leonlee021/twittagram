import React, { useState, useEffect } from 'react'
import './styles/Post.css' 
import { Avatar } from '@mui/material'
import { addDoc, serverTimestamp, collection, doc, onSnapshot, orderBy, query, setDoc, deleteDoc } from '@firebase/firestore';
import { db } from './firebase'
import Moment from 'react-moment';
import 'moment-timezone';
import { HeartIcon } from '@heroicons/react/solid'

function Post({ id, username, imageURL, caption, commenter }) {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => 
    onSnapshot(
      query(
        collection(db,'posts',{id}["id"],'comments'),
        orderBy('timestamp','desc')
        ),
        snapshot => setComments(snapshot.docs)
      ),
    );

  useEffect(
    () =>
      onSnapshot(collection(db,'posts',id,'likes'),(snapshot) => 
        setLikes(snapshot.docs)
    ),
  );

  useEffect(
    ()=> { 
      setHasLiked(likes.findIndex(like => like.id === commenter) !== -1)
    },
    [likes, commenter]
  )

  const sendComment = async (e) => {
    e.preventDefault();

    const commentToSend = comment;
    setComment('');

    const postsRef = collection(db, 'posts')

    await addDoc(collection(doc(postsRef, {id}["id"]),'comments'),{
      comment: commentToSend,
      username: {commenter},
      timestamp: serverTimestamp()
    });
  };

  const likePost = async (e) => {
    if (hasLiked){
      await deleteDoc(doc(db,'posts',{id}["id"],"likes",commenter))
    } else {
      await setDoc(doc(db, 'posts', {id}["id"], "likes", {commenter}['commenter']), {
        username: {commenter}
      })
    }
  }

  return (
      <div className="post"> 
        <div className="post__header">
            <Avatar
                className="post__avatar"
                alt={username}
                src='/static/images/avatar/1.jpg'
            />
            <h3 className="post__username">{username}</h3>
        </div>
        <img className="post__image" src={imageURL} alt=''></img>
        {hasLiked ? (
          <svg xmlns="http://www.w3.org/2000/svg" id="likeButtonFilled" viewBox="0 0 20 20" fill="currentColor" onClick={likePost}>
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
        ): (
          <svg xmlns="http://www.w3.org/2000/svg" id="likeButton" viewBox="0 0 20 20" fill="currentColor" onClick={likePost}>
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
        )
        }
        {likes.length > 0 && (
          <p className="post__likesCount">{likes.length} likes</p>
        )}
        <h4 className="post__caption"><b>{username}</b> {caption}</h4>

        {comments.length > 0 && (
          <div className="post__commentscroll">
            {comments.map(comment => (
              <div key={comment.id} className="post__commentelement">
                <div className="post__commentdiv">
                  <img src="" alt="" />
                  <p className="post__comment">
                    <span><b>{comment.data().username.commenter}</b></span> {comment.data().comment}
                  </p>
                </div>
                <Moment fromNow>
                  {comment.data().timestamp?.toDate()}
                </Moment>
              </div>
            ))}
          </div>
        )}
        
        {commenter ? (
          <form className="post__comments">
            <input
              className = "post__commentbox"
              value = {comment}
              onChange = {e => setComment(e.target.value)}
              type = "text"
              placeholder = "Add a comment..."
            />
            <button type = "button" disabled = {!comment.trim()} onClick = {sendComment} className="post__commentbutton">Post</button>
          </form>
        ):''}
      </div>
  )
}

export default Post