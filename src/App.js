import React, { useState, useEffect } from 'react'
import logo from './logo.svg';
import styles from './styles/styles.css'
import Post from './Post'
import Profile from './Profile'
import { db, auth, createUserWithEmailAndPassword, updateProfile } from './firebase'
import { onSnapshot, collection, query, orderBy } from '@firebase/firestore';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { signInWithEmailAndPassword, signOut } from '@firebase/auth';
import PostUpload from './PostUpload'
import TweetUpload from './TweetUpload'

function App() {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState('');
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(()=>{
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser){
        console.log(authUser);
        setUser(authUser);
      } else {
        setUser(null);
      }
    })

    return() => {
      unsubscribe();
    }
  },[user, username]);

  useEffect(()=>{
    onSnapshot(query(collection(db,'posts'),orderBy('timestamp','desc')), snapshot => {
      setPosts(snapshot.docs.map(doc=>({
        id: doc.id,
        post: doc.data()
      })))
    })
  },[])

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

  const signUp = (event) => {
    event.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        updateProfile(userCredential.user, {
          displayName: username,
        })
      })
      .catch((error) => alert(error.message));
    setOpen(false)
  }

  const signIn = (event) => {
    event.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
    .catch((error) => alert(error.message));
    setOpenSignIn(false)
  }


  return (
    <>
    <div className="app">
      <div className="app__header">
        <a href="#"><h1>Twittagram</h1></a>
        {user ? (
              <PostUpload username = {user.displayName}/> 
            ): ('')}
      </div>
      <div className="app__feed">
        <div className="app__scroll">
          {user ? (
                <TweetUpload username = {user.displayName}/> 
              ): ('')}
          {
            user ? (
            posts.map(({id, post}) => (
              <Post key={id} id = {id} username={post.username} imageURL={post.imageURL} caption={post.caption} commenter = {user.displayName} type = {post.type} timestamp = {post.timestamp}/>
            ))
            ):
            posts.map(({id, post}) => (
              <Post key={id} id = {id} username={post.username} imageURL={post.imageURL} caption={post.caption} type = {post.type} timestamp = {post.timestamp}/>
            ))
          }
        </div>
        <div className="app__profile">
          <div className="app__userline">
            {user ? (<Profile username = {user.displayName}/>) : ('')}
            <div className="app__profileContainer">
              {user ? (
                <Button className = "app__button" onClick={() => signOut(auth)}>Logout</Button>
              ):(
                <div className="app__signInSignUp">
                  <Button className = "app__button" onClick={() => setOpenSignIn(true)}>Sign In</Button>
                  <Button className = "app__button" onClick={() => setOpen(true)}>Sign Up</Button>
                </div>
              )}
            </div>
          </div>

          <Modal
            open={open}
            onClose={() => setOpen(false)}
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                <form className="app__signup">
                  <h1>Twittagram</h1>
                  <Input
                    type = 'text'
                    placeholder = 'username'
                    value = {username}
                    onChange = {(e) => setUsername(e.target.value)}
                  />
                  <Input
                    type = 'text'
                    placeholder = 'email'
                    value = {email}
                    onChange = {(e) => setEmail(e.target.value)}
                  />
                  <Input
                    type = 'text'
                    placeholder = 'password'
                    value = {password}
                    onChange = {(e) => setPassword(e.target.value)}
                  />
                  <p className="app__signupDescription">Reload the page after signing up!</p>
                  <Button type = "submit" onClick = {signUp}>Sign Up</Button>
                </form>
              </Typography>
            </Box>
          </Modal>
          <Modal
            open={openSignIn}
            onClose={() => setOpenSignIn(false)}
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                <form className="app__signup">
                  <h1>Twittagram</h1>
                  <Input
                    type = 'text'
                    placeholder = 'email'
                    value = {email}
                    onChange = {(e) => setEmail(e.target.value)}
                  />
                  <Input
                    type = 'text'
                    placeholder = 'password'
                    value = {password}
                    onChange = {(e) => setPassword(e.target.value)}
                  />
                  <Button type = "submit" onClick = {signIn}>Sign In</Button>
                </form>
              </Typography>
            </Box>
          </Modal>
        </div>
      </div>
    </div >
  </>
  );
}

export default App;
