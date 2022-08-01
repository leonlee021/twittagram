import React, { useState, useEffect } from 'react'
import './styles/Post.css' 
import { Avatar } from '@mui/material'
import { addDoc, serverTimestamp, collection, doc, onSnapshot, orderBy, query } from '@firebase/firestore';
import { storage, db, ref } from './firebase'
import Moment from 'react-moment';
import 'moment-timezone';

function Comment() {
  return (
    <div>Comment</div>
  )
}

export default Comment