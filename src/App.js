import logo from './logo.svg';
import styles from './styles/styles.css'
import Post from './Post'
import React, { useState } from 'react'

function App() {
  const [posts, setPosts] = useState([
    {
      username:'leonlee',
      imageURL:'https://images.complex.com/complex/images/c_fill,dpr_auto,f_auto,q_auto,w_1400/fl_lossy,pg_1/zuhgx0adrt01mtczkpqd/drizzy?fimg-ssr-default',
      caption:'drake larry hoover'
    },
    {
      username: 'champagnepapi',
      imageURL: 'https://i.guim.co.uk/img/media/3e87388c6dd5f3bffd5c1a3940aafb95cb9598f5/60_0_1800_1080/master/1800.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=79f084f4ad8129f9aaea827bbd798177',
      caption: 'kendrick'
    }
  ]);

  return (
    <div className="app">
      <div className="app__header">
        <h1>Twittagram</h1>
      </div>
      <div class="app__feed">
        <div className="app__feed__left">
          {
            posts.map(post => (
              <Post username={post.username} imageURL={post.imageURL} caption={post.caption} />
            ))
          }
        </div>
        <div className="app__feed__right">
          <h2>feed__right</h2>
        </div>
      </div>
    </div >
  );
}

export default App;
