import React from 'react'
import { Avatar } from '@mui/material'
import './styles/Profile.css'

function Profile() {
  return (
      <div className='profile'>
        <Avatar
            className="profile__avatar"
            alt='Leon'
            src='/static/images/avatar/1.jpg'
        />
        <div className="profile__text">
            <h3 className="profile__name">Leon Lee</h3>
            <h4 className="profile__username">@leonlee__</h4>
        </div>
      </div>
  )
}

export default Profile