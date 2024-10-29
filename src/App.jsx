import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ClientSignupForm from './components/ClientSignupForm/ClientSignupForm';
import ProviderSignupForm from './components/ProviderSignupForm/ProviderSignupForm';
import SigninForm from './components/SigninForm/SigninForm';
import Dashboard from './components/Dashboard/Dashboard';
import Landing from './components/Landing/Landing';
import NavBar from './components/Partials/Navbar/NavBar';
import ProviderList from './components/ProviderList/ProviderList'; // Import the ProviderList component
import ProviderDetails from './components/ProviderDetails/ProviderDetails'
import Footer from './components/Partials/Footer/Footer';

const App = () => {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register/client" element={<ClientSignupForm />} /> 
        <Route path="/register/provider" element={<ProviderSignupForm />} /> 
        <Route path="/login" element={<SigninForm />} /> 
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/providerlist" element={<ProviderList />} />
        <Route path="/providerlist/:providerId" element={<ProviderDetails />} />
        {/* Add more routes as needed */}
      </Routes>
      <Footer />
    </>
  );
};

export default App;
