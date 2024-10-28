import React from 'react'
import { Link } from 'react-router-dom'

 const ProviderList = (props) =>{
  return (
    <>
        <div>ProviderList</div>
        {/* TODO: This is a stub using our current provider model, will not run until we connect our models */}
        {/* commented out until it works */}
        {props.providers.map((prov)=>(
            <Link key={prov._id} to={`/providerlist/${prov._id}`}>
                <h1>`{prov.lastName}, {prov.firstName}`</h1>
                <p>{prov.credentials}</p>
                <p>{prov.location}</p>
                <p>{prov.bio}</p>
                {prov.insuranceAccepted.forEach(ins => {
                    <p>{ins}</p>
                })}
            </Link>
        ))}
    </>
  )
}

export default ProviderList