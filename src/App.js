import React, { useState, useEffect } from 'react'
import logo from './logo.svg';
import styles from './styles/styles.css'
import Post from './Post'
import Profile from './Profile'
import { db } from './firebase'
import { doc, onSnapshot, collection } from '@firebase/firestore';

function App() {
  const [posts, setPosts] = useState([]);

  const postsCol = collection(db,'posts')

  useEffect(()=>{
    onSnapshot(postsCol, snapshot => {
      setPosts(snapshot.docs.map(doc=>({
        id: doc.id,
        post: doc.data()
      })))
    })
  },[])

  return (
    <div className="app">
      <div className="app__header">
        <h1>Twittagram</h1>
      </div>
      <div className="app__feed">
        <div className="app__feed__left">
          {
            posts.map(({id, post}) => (
              <Post key={id} username={post.username} imageURL={post.imageURL} caption={post.caption} />
            ))
          }
        </div>
        <div className="app__feed__right">
          <Profile />
        </div>
      </div>
    </div >
  );
}

export default App;
