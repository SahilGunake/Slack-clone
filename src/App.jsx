import { useState } from 'react'
import './App.css'
import SlackClone from './SlackClone'


function App() {

  return (
    <>
      {/* {user ? <SlackClone user={user} /> : <Login onAuth={setUser} />} */}
      <SlackClone/>
    </>
  )
}

export default App
