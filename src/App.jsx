import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Landing from './pages/landing'
import Home from './pages/home'
import './App.css'
import Ava from './pages/ava'
import Voyage from './pages/voyage'
import Hop from './pages/hop'
import P from './pages/penny'

function App() {

  return (
    <div>
     <Router>
      <Routes>
        <Route path='/' element={<Landing/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/ava' element={<Ava/>}/>
        <Route path='/voyage' element={<Voyage/>}/>
        <Route path='/hop' element={<Hop/>}/>
        <Route path='/penny' element={<P/>}/>
      </Routes>
     </Router>
    </div>
  )
}

export default App
