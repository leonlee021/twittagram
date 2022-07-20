import React from 'react'
import './styles/Post.css' 
import { Avatar } from '@mui/material'

function Post({username, imageURL, caption}) {
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
        <img className="post__image" src={imageURL}></img>
        <h4 className="post__caption"><b>{username}</b> {caption}</h4>
      </div>
    //   header
    // image
    // caption
  )
}

export default Post