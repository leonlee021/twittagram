import React from 'react'
import { Avatar } from '@mui/material'
import './styles/Profile.css'

function Profile({username}) {
  return (
      <div className='profile'>
        <Avatar
            className="profile__avatar"
            alt={username}
            src='/static/images/avatar/1.jpg'
        />
        <div className="profile__text">
            {/* <h3 className="profile__name">Leon Lee</h3> */}
            <h4 className="profile__username">{username}</h4>
        </div>
      </div>
  )
}

export default Profile