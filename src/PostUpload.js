import React, { useState, useRef } from 'react'
import Button from '@mui/material/Button';
import { storage, db, ref } from './firebase'
import { collection, serverTimestamp, addDoc, updateDoc, doc } from '@firebase/firestore';
import { getDownloadURL, uploadString } from '@firebase/storage';

function PostUpload({username}) {
    const filePickerRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const captionRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null)

    const handleChange = (e) => {
      const reader = new FileReader();
        if (e.target.files[0]){
            reader.readAsDataURL(e.target.files[0]);
        }

        reader.onload = (readerEvent) => {
          setSelectedFile(readerEvent.target.result);
        }
    }

    const handlePostUpload = async () => {
      if (loading) return;
      setLoading(true);

      const docRef = await addDoc(collection(db, 'posts'),{
        username: username,
        caption: captionRef.current.value,
        timestamp: serverTimestamp()
      })

      const imageRef = ref(storage, `images/${docRef.id}`);

      await uploadString(imageRef, selectedFile,"data_url").then(async snapshot => {
        const downloadURL = await getDownloadURL(imageRef);

        await updateDoc(doc(db, 'posts', docRef.id),{
          imageURL: downloadURL
        })
      })
    }

  return (
      <div>
        <input type="text" placeholder = "Enter a caption..." ref = {captionRef}/>
        <input type="file" ref = {filePickerRef} onChange={handleChange} />
        <Button onClick={handlePostUpload}>Upload</Button>
      </div>    
  )
}

export default PostUpload