import { useState, createContext, useEffect } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import './App.css'
import NavBar from './components/Partials/Navbar/NavBar'
import Footer from './components/Partials/Footer/Footer'
import ProviderList from './components/ProviderList/ProviderList'
import * as providerService from './services/providerService.js'
import * as authService from './services/authService.js'
import Landing from './components/Landing/Landing.jsx'
import SignupForm from './components/SignupForm/SignupForm.jsx'
import SigninForm from './components/SigninForm/SigninForm.jsx'

export const AuthedClientContext = createContext(null)


function App() {

  const [client,setClient] = useState(null)
  // Currently storing array of providers in this state
  const[providers, setProviders] = useState([])

  useEffect (()=>{
    const clientData = authService.getClient()
    setClient(clientData)
  },[])

  // Picks up all providers in launch (should we move this down?)
  useEffect(()=>{
    const fetchAllProviders = async () =>{
      const providerData = await providerService.fetchProviders()
      // console.log('Providers:', providerData) 
      setProviders(providerData)
    }
    fetchAllProviders()
  },[])

  const handleSignout = () =>{
    authService.signout();
    setClient(null)
  }



  return (
    <>
      <AuthedClientContext.Provider value={client}>

      <NavBar />
        <Routes>
          {/*TODO: create Client sign in to make protected/unprotected routes.. also, should Client be client at this point? We have both Clients and clients right now. */}
          {client ? (
            // Protected routes here
            <Route/>

           ) : ( 
            // Unprotected routes (Client not signed up) here
            <>
            <Route path="/" element={<Landing/>} />
            <Route path="/providerlist" element={<ProviderList providers={providers}/>} />
            </>
          )} 
           
          <Route path="/signup" element={<SignupForm setClient={setClient}/>} />
          <Route path="/signin" element={<SigninForm setClient={setClient}/>} />
        </Routes>
      <Footer />
      </AuthedClientContext.Provider>
    </>
  )
}

export default App