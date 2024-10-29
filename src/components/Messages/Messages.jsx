import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext';

const Messages = (props) => {
    const user = useAuth()

    // Only get messages related to that user 
    // get recieversId and Contents of the msg
    // display if read 

    return (
        <>
        <h1>RecieverId</h1>
        <p>Contents of the Message Go here</p>
        </>
    )
}

export default Messages 