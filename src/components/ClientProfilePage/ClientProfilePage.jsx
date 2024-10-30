import React from 'react'
import { useState, useEffect } from 'react'
import { getClient } from '../../services/dashboardService';

function ClientProfilePage() {
    
    const [profile, setProfile] =  useState([
        // "_id": "67223965c41239738121d4b5",
        // "email": "gabedotgutierrez@gmail.com",
        // "firstName": "Gabriel",
        // "lastName": "Gutierrez",
        // "location": "The net",
        // "insuranceProvider": "Out of pocket",
        // "therapyGoals": "get a job",
        // "savedProviders": [],
        // "createdAt": "2024-10-30T13:49:25.992Z",
        // "updatedAt": "2024-10-30T13:49:25.992Z"
        ])

        useEffect(() => {
            const loadClientProfile = async () => {
                try {
                    const data = await getClient();
                    setProfile(data)
                    console.log(profile)
                } catch (err) {
                    console.error("Error fetching providers:", err);
                    setError("Failed to load providers");
                } 
            };
            loadClientProfile();
        }, []);
        
    return (


    <>
        <div>ClientProfilePage</div>
        <div>ClientProfilePage</div>
        <div>ClientProfilePage</div>
        <div>ClientProfilePage</div>
        <div>ClientProfilePage</div>
        <div>{profile.email}</div>
        <div>ClientProfilePage</div>
        <div>ClientProfilePage</div>
        <div>ClientProfilePage</div>
        <div>{profile.email}</div>
        <div>Cool</div>
    </>
  )
}

export default ClientProfilePage