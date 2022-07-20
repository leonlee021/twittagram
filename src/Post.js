import React from 'react'
import './styles/Post.css' 
import { Avatar } from '@mui/material'

function Post() {
  return (
      <div className="post"> 
        <div className="post__header">
            <Avatar
                className="post__avatar"
                alt='leonlee'
            />
            <h3 className="post__username">leonlee</h3>
        </div>
        <img className="post__image" src="https://images.complex.com/complex/images/c_fill,dpr_auto,f_auto,q_auto,w_1400/fl_lossy,pg_1/zuhgx0adrt01mtczkpqd/drizzy?fimg-ssr-default"></img>
        <h4 className="post__caption"><b>leonlee</b> Caption</h4>
      </div>
    //   header
    // image
    // caption
  )
}

export default Post