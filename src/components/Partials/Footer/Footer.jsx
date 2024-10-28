import { Link } from 'react-router-dom'
import { useState } from 'react'

const Footer = () => {
    const user = false


    return (
        <>
        <footer>
           <h3>TalkThrough.it (c) 2024</h3>
           <p>Created by Timothy Lim, Emmanuel Rosario, Joey Pierre & Gabe Gutierrez</p>
           <p>Github: <Link to="https://github.com/RosarioManny/TalkThrough.it-Front-End/tree/er-Navbar" >Front-End </Link> || 
           <Link to="https://github.com/Nottimlim/TalkThroughIt-Backend"> Back-End </Link>
            </p>
        </footer>
        </>
    )
};

export default Footer