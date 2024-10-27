import { useState } from 'react'
import { Link, Route } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import NavBar from './components/Partials/Navbar/NavBar'
import Footer from './components/Partials/Footer/Footer'
import ProviderList from './components/ProviderList/ProviderList'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <NavBar />
      {/*TODO: create user sign in to make protected/unprotected routes.. also, should user be client at this point? We have both users and clients right now. */}
      {user ? (
        // Protected routes here
        <Route/>

      ) : (
        // Unprotected routes (user not signed up) here
        <>
        <Route path="/" element={<Landing/>} />
        <Route path="/ProviderList" element={<ProviderList/>} />
        </>
      )}
      <Route path="/signup" element={<SignupForm setUser={setUser}/>} />
      <Route path="/signup" element={<SigninForm setUser={setUser}/>} />
    
    <Footer />
    </>
  )
}

export default App
