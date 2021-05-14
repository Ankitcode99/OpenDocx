import TextEditor from './TextEditor';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom'
import './styles.css';
import {v4 as uuidV4} from 'uuid'

function App() {
  return (
    <div>
    <p className='appname'>Open Docx</p>
    <p className='desc'>The only text editor you need &#128521;</p>
    <p className='goodbye'>Made with &hearts; by  <a href='https://github.com/Ankitcode99' target='_blank'>AnkitCode99</a></p>
    <Router>
      <Switch>
        <Route path='/' exact>
          <Redirect to={`/document/${uuidV4()}`}/>
        </Route>
        <Route path='/document/:id'>
          <TextEditor />
        </Route>
      </Switch>
    </Router>

    <br></br>
    </div>
    )
}

export default App;
