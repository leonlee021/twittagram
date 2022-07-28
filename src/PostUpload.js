import React, { useState, useRef } from 'react'
import Button from '@mui/material/Button';
import { storage, db, ref } from './firebase'
import { collection, serverTimestamp, addDoc, updateDoc, doc } from '@firebase/firestore';
import { getDownloadURL, uploadString } from '@firebase/storage';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';


function PostUpload({username}) {
    const filePickerRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const captionRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null)
    const [openPost, setOpenPost] = useState(false);

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

      setOpenPost(false)
      setLoading(false)
      setSelectedFile(null)
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
          <Button className = "postUpload__button" onClick={() => setOpenPost(true)}>Upload</Button>
          <Modal
            open={openPost}
            onClose={() => setOpenPost(false)}
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                <form className="postUpload__post">
                  <h1>Twittagram</h1>
                  <input
                    type = 'text'
                    placeholder = 'Enter a caption...'
                    ref = {captionRef}
                  />
                  <input
                    type = 'file'
                    ref = {filePickerRef}
                    onChange={handleChange}
                  />
                  <Button type = "button" onClick = {handlePostUpload}>Upload</Button>
                </form>
              </Typography>
            </Box>
          </Modal>
      </div>    
  )
}

export default PostUpload