import { Link } from 'react-router-dom'
import { useState } from 'react'

const NavBar = () => {

    //TODO: allow user to be signed in after creating a client provider. Right now it's hardcoded to false.
    const user = false


    return (
        <>
        <Link to="/">TalkThroughIt</Link>
        {user ? (
        <nav>
            <Link to="/providerlist">Find Provider </Link>
            <Link to="/message">Message </Link>
            <Link to="/" onClick={() => signOut()}>Sign Out </Link>
        </nav>
        ) : (
        <nav>
            <Link to="/providerlist">Find Provider </Link>
            <Link to="/register/client">Client Sign Up </Link>
            <Link to="/register/provider">Provider Sign Up </Link>
            <Link to="/login">Sign In </Link>
        </nav>
        )}
        </>
    )
};

export default NavBar
