import { Link } from 'react-router-dom'
import { useState } from 'react'

const NavBar = () => {
    const user = false


    return (
        <>
        <Link to="/">TalkThroughIt</Link>
        {user ? (
        <nav>
            <Link to="providerlist">Find Provider </Link>
            <Link to="message">Message </Link>
            <Link to="signout">Sign-Out </Link>
        </nav>
        ) : (
        <nav>
            <Link to="providerlist">Find Provider </Link>
            <Link to="message">Message </Link>
            <Link to="signin">Sign-In </Link>
            <Link to="signup/client">Sign-In Client </Link>
            <Link to="signup/provider">Sign-In Provider </Link>
        </nav>
        )}
        </>
    )
};

export default NavBar
