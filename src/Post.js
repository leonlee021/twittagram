import React, { useState, useEffect } from 'react'
import './styles/Post.css' 
import { Avatar } from '@mui/material'
import { addDoc, serverTimestamp, collection, doc, onSnapshot, orderBy, query, setDoc, deleteDoc } from '@firebase/firestore';
import { db } from './firebase'
import Moment from 'react-moment';
import 'moment-timezone';
import { HeartIcon, BookmarkIcon, ChatIcon, PaperAirplaneIcon, ChatAltIcon, RefreshIcon, UploadIcon } from '@heroicons/react/outline'
import { HeartIcon as HeartIconFilled } from '@heroicons/react/solid'
import { width } from '@mui/system';

function Post({ id, username, imageURL, caption, commenter, type, timestamp }) {
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
    <>
      { type === 'insta' ? (
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
      <div class="post__iconFullRow">
        <div className="post__iconRow">
          {hasLiked ? (
            <HeartIconFilled id="likeButtonFilled" onClick={likePost} />
          ): (
            <HeartIcon id="likeButton" onClick={likePost} />
          )
          }
          <ChatIcon className="btn"/>
          <PaperAirplaneIcon className="btn"/>
        </div>
        <BookmarkIcon className="btn" id="bookmarkIcon"/>
      </div>
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
      ) : (
        // TWEET
        <div className="tweet"> 
          <div className="tweet__body">
            <div className="tweet__header">
                <Avatar
                    className="tweet__avatar"
                    alt={username}
                    src='/static/images/avatar/1.jpg'
                />
                <div class="tweet__words">
                  <div className="tweet__usernameAndTime">
                    <h3 className="tweet__username">{username} <span className="tweet__atUsername">@{username}</span>&nbsp;&nbsp;•</h3>
                    <Moment fromNow>
                      {timestamp?.toDate()}
                    </Moment>
                  </div>
                  <h4 className="tweet__caption">{caption}</h4>
                </div>
            </div>
              <div className="tweet__iconLine">
                <ChatAltIcon className="tweetbtn"/>
                <RefreshIcon className="tweetbtn"/>
                <div class="tweet__likeFeature">
                  {hasLiked ? (
                    <HeartIconFilled id="likeButtonFilled" onClick={likePost} className="tweetbtn" />
                  ): (
                    <HeartIcon id="likeButton" onClick={likePost} className="tweetbtn"/>
                  )
                  }
                </div>
                <UploadIcon className="tweetbtn"/>
              </div>
          </div>
          {comments.length > 0 && (
          <div className="tweet__commentscroll">
            {comments.map(comment => (
              <div key={comment.id} className="tweet__commentelement">
                <div className="post__commentdiv">
                  <img src="" alt="" />
                  <p className="tweet__comment">
                    <Avatar
                        className="tweet__avatar"
                        alt={comment.data().username.commenter}
                        src='/static/images/avatar/1.jpg'
                    />
                    <div class="tweet__words">
                      <div className="tweet__commentTime">
                        <h3 className="tweet__username">{comment.data().username.commenter} <span className="tweet__atUsername">@{comment.data().username.commenter}</span>&nbsp;&nbsp;•</h3>
                        <Moment fromNow>
                          {comment.data().timestamp?.toDate()}
                        </Moment>
                      </div>
                      <h4 className="tweet__caption">{comment.data().comment}</h4>
                      {/* <div className="tweet__iconLineComment">
                        <ChatAltIcon className="tweetbtn"/>
                        <RefreshIcon className="tweetbtn"/>
                        <div class="tweet__likeFeature">
                          {hasLiked ? (
                            <HeartIconFilled id="likeButtonFilled" onClick={likePost} className="tweetbtn" />
                          ): (
                            <HeartIcon id="likeButton" onClick={likePost} className="tweetbtn"/>
                          )
                          }
                        </div>
                        <UploadIcon className="tweetbtn"/>
                      </div> */}
                    </div>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      
      {commenter ? (
        <form className="tweet__comments">
          <Avatar
            className="tweet__avatar"
            alt={commenter}
            src='/static/images/avatar/1.jpg'
          />
          <input
            className = "tweet__commentbox"
            value = {comment}
            onChange = {e => setComment(e.target.value)}
            type = "text"
            placeholder = "Tweet your reply"
          />
          <button type = "button" disabled = {!comment.trim()} onClick = {sendComment} className="tweet__commentbutton">Reply</button>
        </form>
      ):''}
      </div>
      )
    }
  </>
  )
}

export default Post