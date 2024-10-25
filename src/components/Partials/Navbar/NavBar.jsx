import { Link } from 'react-router-dom'
import { useState } from 'react'

const NavBar = () => {
    const user = false


    return (
        <>
        <Link to="/">TalkThroughIt</Link>
        {user ? (
        <nav>
            <Link to="provider">Find Provider</Link>
            <Link to="message">Message</Link>
            <Link to="signout">Sign-Out</Link>
        </nav>
        ) : (
        <nav>
            <Link to="provider">Find Provider</Link>
            <Link to="message">Message</Link>
            <Link to="signup">Sign-Up</Link>
            <Link to="signiin">Sign-In</Link>
        </nav>
        )}
        </>
    )
};

export default NavBar
