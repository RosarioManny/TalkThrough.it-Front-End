//TODO:Lput in the full view of the details of a single provider here, put the message button here too? - Gabe
import {useState, useEffect} from 'react'
import React from 'react'
import { useParams } from 'react-router-dom'
import { showProviders } from '../../services/providerService';

const ProviderDetails = (props) => {
     const {providerId} = useParams();
     const [provider, setProvider] = useState(null);
     
     useEffect (() => {
      const fetchProviders =async ()=>{
      const providerData = await showProviders(providerId);
      setProvider(providerData);
      }
      fetchProviders()
    },[])

    console.log(`${provider}`)
  return (
    <>
    <h1>TODO: display full provider details here. - Gabe</h1>
    <div>ProviderDetails</div>
    </>
  )
}

export default ProviderDetails