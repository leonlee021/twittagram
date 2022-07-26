import React, { useState } from 'react'
import Button from '@mui/material/Button';
import { storage, db, ref } from './firebase'
import { collection, serverTimestamp, addDoc } from '@firebase/firestore';
import { getDownloadURL,uploadBytesResumable } from '@firebase/storage';

function PostUpload({username}) {
    const [image, setImage] = useState(null);
    const [caption, setCaption] = useState('');


    const handleChange = (e) => {
        if (e.target.files[0]){
            setImage(e.target.files[0]);
        }
    }

    const handlePostUpload = () => {
        // const uploadTask = ref(storage,`images/${image.name}`).put(image);
        const uploadTask = uploadBytesResumable(ref(storage,`images/${image.name}`))
        uploadTask.on(
            (error) => {
                console.log(error);
                alert(error.message);
            },
            () => {
                getDownloadURL(ref(storage,`images/${image.name}`))
                .then(url => {
                    addDoc(collection(db, "posts"),{
                        timestamp: serverTimestamp(),
                        caption: caption,
                        imageURL: url,
                        username: username
                    });
                    setCaption("");
                    setImage(null);
                })
            }
        )
    }

  return (
      <div>
        <input type="text" placeholder = "Enter a caption..." onChange = {event => setCaption(event.target.value)} value = {caption}/>
        <input type="file" onChange={handleChange} />
        <Button onClick={handlePostUpload}>Upload</Button>
      </div>    
  )
}

export default PostUpload