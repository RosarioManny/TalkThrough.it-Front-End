import { useState, createContext, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ClientSignupForm from './components/ClientSignupForm/ClientSignupForm';
import ProviderSignupForm from './components/ProviderSignupForm/ProviderSignupForm';
import SigninForm from './components/SigninForm/SigninForm';
import ClientDashboard from './components/Dashboard/ClientDashboard';
import ProviderDashboard from './components/Dashboard/ProviderDashboard';
import Landing from './components/Landing/Landing';
import NavBar from './components/Partials/Navbar/NavBar';
import ClientNavBar from './components/Partials/Navbar/ClientNavBar';
import ProviderNavBar from './components/Partials/Navbar/ProviderNavBar';
import ProviderList from './components/ProviderList/ProviderList';
import ProviderDetails from './components/ProviderDetails/ProviderDetails';
import Footer from './components/Partials/Footer/Footer';
import { getUser, signOut } from './services/authService';

export const AuthedUserContext = createContext(null);

const App = () => {
  // const [user, setUser] = useState(); (might have to return to this, because use auth is no longer a state)
  const { user, setUser } = useAuth();

  useEffect(() => {
    const userData = getUser();
    setUser(userData);
  }, [setUser]);

  const handleSignOut = () => {
    signOut();
    setUser(null);
  };


  // Function to determine which navbar to show
  const renderNavBar = () => {
    if (!user) return <NavBar user={user} handleSignOut={handleSignOut} />;
    if (user.userType === 'provider') return <ProviderNavBar user={user} handleSignOut={handleSignOut} />;
    return <ClientNavBar user={user} handleSignOut={handleSignOut} />;
  };

  return (
    <>
      <AuthedUserContext.Provider value={user}>
        {renderNavBar()}
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register/client" element={<ClientSignupForm />} />
          <Route path="/register/provider" element={<ProviderSignupForm />} />
          <Route path="/login" element={<SigninForm setUser={setUser} />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<SigninForm />} />
          <Route path="/client/dashboard" element={<ClientDashboard />} />
          <Route path="/provider/dashboard" element={<ProviderDashboard />} />
          <Route path="/providerlist" element={<ProviderList />} />
          <Route
            path="/providerlist/:providerId"
            element={<ProviderDetails />}
          />
        </Routes>
        <Footer />
      </AuthedUserContext.Provider>
    </>
  );
};

export default App;