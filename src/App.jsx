import { useState, createContext, useEffect } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import './App.css'
import NavBar from './components/Partials/Navbar/NavBar'
import Footer from './components/Partials/Footer/Footer'
import ProviderList from './components/ProviderList/ProviderList'
import * as providerService from './services/providerService.js'

function App() {
  const [count, setCount] = useState(0)

  // Currently storing array of providers in this state
  const[providers, setProviders] = useState([])

  // Picks up all providers in launch (should we move this down?)
  useEffect(()=>{
    const fetchAllProviders = async () =>{
      const providerData = await providerService.index()
      // console.log('Providers:', providerData) 
      setProviders(providerData)
    }
    fetchAllProviders()
  },[])


  return (
    <>
    <NavBar />
      <Routes>
        {/*TODO: create user sign in to make protected/unprotected routes.. also, should user be client at this point? We have both users and clients right now. */}
        {/* {user ? ( */}
          // Protected routes here
          <Route/>

        {/* ) : ( */}
          // Unprotected routes (user not signed up) here
          <>
          {/* <Route path="/" element={<Landing/>} /> */}
          <Route path="/ProviderList" element={<ProviderList providers={providers}/>} />
          </>
        {/* )} */}
        {/* <Route path="/signup" element={<SignupForm setUser={setUser}/>} /> */}
        {/* <Route path="/signup" element={<SigninForm setUser={setUser}/>} /> */}
      </Routes>
    <Footer />
    </>
  )
}

export default App
