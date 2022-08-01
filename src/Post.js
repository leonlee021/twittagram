import React, { useState, useEffect } from 'react'
import './styles/Post.css' 
import { Avatar } from '@mui/material'
import { addDoc, serverTimestamp, collection, doc, onSnapshot, orderBy, query } from '@firebase/firestore';
import { db } from './firebase'
import Moment from 'react-moment';
import 'moment-timezone';

function Post({ id, username, imageURL, caption, commenter }) {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);

  useEffect(() => 
    onSnapshot(
      query(
        collection(db,'posts',{id}["id"],'comments'),
        orderBy('timestamp','desc')
        ),
        snapshot => setComments(snapshot.docs)
      ),
    );

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

        {comments.length > 0 && (
          <div className="post__commentscroll">
            {comments.map(comment => (
              <div key={comment.id} className="post__commentelement">
                <div class="post__commentdiv">
                  <img src="" alt="" />
                  <p className="post__comment">
                    <span><b>{commenter}</b></span> {comment.data().comment}
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