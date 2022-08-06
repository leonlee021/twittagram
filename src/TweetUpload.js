import React, { useState, useRef } from 'react'
// import Button from '@mui/material/Button';
import { storage, db, ref } from './firebase'
import { collection, serverTimestamp, addDoc, updateDoc, doc } from '@firebase/firestore';
import { getDownloadURL, uploadString } from '@firebase/storage';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import './styles/TweetUpload.css'
import { PhotographIcon } from '@heroicons/react/solid'
import { Avatar } from '@mui/material'


function TweetUpload({username}) {
    const [loading, setLoading] = useState(false);
    const captionRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null)
    const [openTweet, setOpenTweet] = useState(false);

    const handleTweetUpload = async () => {
      if (loading) return;
      setLoading(true);

      const docRef = await addDoc(collection(db, 'posts'),{
        username: username,
        caption: captionRef.current.value,
        timestamp: serverTimestamp(),
        type: 'tweet'
      })

      setOpenTweet(false)
      setLoading(false)
    }

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        };
  return (
    <div>
        <form className="tweetUpload__post">
            <div className="tweetUpload__tweetLine">
                <Avatar
                        className="post__avatar"
                        alt={username}
                        src='/static/images/avatar/1.jpg'
                    />
                <input
                    type = 'text'
                    placeholder = "What's happening?"
                    className = 'tweetUpload__tweetContent'
                    ref = {captionRef}
                />
            </div>
            <div className="tweetUpload__buttonLine"><button type = "button" className = "tweetUpload__button" onClick = {handleTweetUpload}>Tweet</button></div>
        </form>
    </div>
  )
}

export default TweetUpload