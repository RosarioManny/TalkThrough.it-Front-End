import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; // Add this import
import ClientSignupForm from './components/ClientSignupForm/ClientSignupForm';
import ProviderSignupForm from './components/ProviderSignupForm/ProviderSignupForm';
import SigninForm from './components/SigninForm/SigninForm';
import ClientDashboard from './components/Dashboard/ClientDashboard';
import ProviderDashboard from './components/Dashboard/ProviderDashboard';
import Landing from './components/Landing/Landing';
import NavBar from './components/Partials/Navbar/NavBar';
import ClientNavBar from './components/Partials/Navbar/ClientNavBar'; // New component
import ProviderNavBar from './components/Partials/Navbar/ProviderNavBar'; // New component
import ProviderList from './components/ProviderList/ProviderList';
import ProviderDetails from './components/ProviderDetails/ProviderDetails';
import Footer from './components/Partials/Footer/Footer';

const App = () => {
  const { user } = useAuth();

  // Function to determine which navbar to show
  const renderNavBar = () => {
    if (!user) return <NavBar />;
    if (user.userType === 'provider') return <ProviderNavBar />;
    return <ClientNavBar />;
  };

  return (
    <>
      {renderNavBar()}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register/client" element={<ClientSignupForm />} /> 
        <Route path="/register/provider" element={<ProviderSignupForm />} /> 
        <Route path="/login" element={<SigninForm />} /> 
        <Route path="/client/dashboard" element={<ClientDashboard />} />
        <Route path="/provider/dashboard" element={<ProviderDashboard />} />
        <Route path="/providerlist" element={<ProviderList />} />
        <Route path="/providerlist/:providerId" element={<ProviderDetails />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
