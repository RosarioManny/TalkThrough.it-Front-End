import { Link } from 'react-router-dom'
import { useState } from 'react'

const NavBar = () => {
    const user = false


    return (
        <>
        <footer>
            <Link to="provider">Find Provider</Link>
            <Link to="message">Message</Link>
            <Link to="signup">Sign-Up</Link>
            <Link to="signiin">Sign-In</Link>
        </footer>
        </>
    )
};

export default NavBar