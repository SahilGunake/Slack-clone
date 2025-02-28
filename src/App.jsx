import { useState } from 'react'
import './App.css'
import SlackClone from './SlackClone'
import Login from './Login'

function App() {
  const [user, setUser] = useState(null);

  return (
    <>
      {/* {user ? <SlackClone user={user} /> : <Login onAuth={setUser} />} */}
      <SlackClone/>
    </>
  )
}

export default App
