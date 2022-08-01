import React, { useState } from 'react'
import './styles/Post.css' 
import { Avatar } from '@mui/material'
import { addDoc, serverTimestamp, collection, doc } from '@firebase/firestore';
import { storage, db, ref } from './firebase'

function Post({ id, username, imageURL, caption }) {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  const sendComment = async (e) => {
    e.preventDefault();

    const commentToSend = comment;
    setComment('');

    const postsRef = collection(db, 'posts')

    await addDoc(collection(doc(postsRef, {id}["id"]),'comments'),{
      comment: commentToSend,
      username: {username},
      timestamp: serverTimestamp()
    });
  };

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
        <h4 className="post__caption"><b>{username}</b> {caption}</h4>
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
      </div>
    //   header
    // image
    // caption
  )
}

export default Post