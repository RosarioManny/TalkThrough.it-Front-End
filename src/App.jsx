import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ClientSignupForm from './components/ClientSignupForm/ClientSignupForm';
import ProviderSignupForm from './components/ProviderSignupForm/ProviderSignupForm';
import SigninForm from './components/SigninForm/SigninForm';
import Dashboard from './components/Dashboard/Dashboard';
import Landing from './components/Landing/Landing';
import NavBar from './components/Partials/Navbar/NavBar';
import ProviderList from './components/ProviderList/ProviderList'; // Import the ProviderList component
import Footer from './components/Partials/Footer/Footer';

const App = () => {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register/client" element={<ClientSignupForm />} /> {/* Changed from /signup/client */}
        <Route path="/register/provider" element={<ProviderSignupForm />} /> {/* Changed from /signup/provider */}
        <Route path="/login" element={<SigninForm />} /> {/* Changed from /signin */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/providerlist" element={<ProviderList />} />
        {/* Add more routes as needed */}
      </Routes>
      <Footer />
    </>
  );
};

export default App;
