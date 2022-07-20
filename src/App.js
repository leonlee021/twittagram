import logo from './logo.svg';
import styles from './styles/styles.css'
import Post from './Post'

function App() {
  return (
    <div className="app">
      <div className="app__header">
        <h1>Twittagram</h1>
      </div>
      <div class="app__feed">
        <div className="app__feed__left">
          {/* <h2>feed__left</h2> */}
          <Post />
          <Post />
        </div>
        <div className="app__feed__right">
          <h2>feed__right</h2>
        </div>
      </div>
    </div >
  );
}

export default App;
