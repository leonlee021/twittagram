import React, { useState, useRef } from 'react'
import Button from '@mui/material/Button';
import { storage, db, ref } from './firebase'
import { collection, serverTimestamp, addDoc, updateDoc, doc } from '@firebase/firestore';
import { getDownloadURL, uploadString } from '@firebase/storage';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import './styles/PostUpload.css'
import { PhotographIcon } from '@heroicons/react/solid'
import { PlusCircleIcon } from '@heroicons/react/outline'


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
        timestamp: serverTimestamp(),
        type: 'insta'
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
          <label className="postUpload__upload">
            <Button className = "postUpload__button" onClick={() => setOpenPost(true)}>
              <PlusCircleIcon className="postUpload__plusCircle"/>
            </Button>
          </label>
            <Modal
              open={openPost}
              onClose={() => setOpenPost(false)}
            >
              <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  <form className="postUpload__post">
                    <h1>Twittagram</h1>
                    <label className = 'postUpload__file'>
                      <input
                        type = 'file'
                        ref = {filePickerRef}
                        onChange={handleChange}
                      />
                      {selectedFile ? (
                        <img src = {selectedFile} alt = "" className="postUpload__image"/>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      )
                      }
                    </label>
                    <input
                      type = 'text'
                      placeholder = 'Enter a caption...'
                      className = 'postUpload__caption'
                      ref = {captionRef}
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