import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ClientSignupForm from './components/ClientSignupForm/ClientSignupForm';
import ProviderSignupForm from './components/ProviderSignupForm/ProviderSignupForm';
import { SigninForm } from './components/SigninForm/SigninForm';
import ClientDashboard from './components/Dashboard/ClientDashboard';
import ProviderDashboard from './components/Dashboard/ProviderDashboard';
import Landing from './components/Landing/Landing';
import NavBar from './components/Partials/Navbar/NavBar';
import ClientNavBar from './components/Partials/Navbar/ClientNavBar';
import ProviderNavBar from './components/Partials/Navbar/ProviderNavBar';
import ProviderList from './components/ProviderList/ProviderList';
import ProviderDetails from './components/ProviderDetails/ProviderDetails';
import ProviderAppointments from './components/Appointments/ProviderAppointments';
import ProviderAvailability from './components/Availability/ProviderAvailability';
import Footer from './components/Partials/Footer/Footer';

const App = () => {
    const { user, handleSignOut } = useAuth();

    const renderNavBar = () => {
        if (!user) return <NavBar handleSignOut={handleSignOut} />;
        if (user.type === 'provider') return <ProviderNavBar handleSignOut={handleSignOut} />;
        return <ClientNavBar handleSignOut={handleSignOut} />;
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
                <Route path="/provider/appointments" element={<ProviderAppointments />} />
                <Route path="/provider/availability" element={<ProviderAvailability />} />
                <Route path="/providerlist" element={<ProviderList />} />
                <Route path="/providerlist/:providerId" element={<ProviderDetails />} />
            </Routes>
            <Footer />
        </>
    );
};

export default App;
