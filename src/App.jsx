import React from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { ClientSignupForm } from "./components/ClientSignupForm/ClientSignupForm";
import { ProviderSignupForm } from "./components/ProviderSignupForm/ProviderSignupForm";
import { SigninForm } from "./components/SigninForm/SigninForm";
import { ClientDashboard } from "./components/Dashboard/ClientDashboard";
import { ProviderDashboard } from "./components/Dashboard/ProviderDashboard";
import { Landing } from "./components/Landing/Landing";
import { NavBar } from "./components/Partials/Navbar/NavBar";
import { ClientNavBar } from "./components/Partials/Navbar/ClientNavBar";
import { ProviderNavBar } from "./components/Partials/Navbar/ProviderNavBar";
import { ProviderList } from "./components/ProviderList/ProviderList";
import { ProviderDetails } from "./components/ProviderDetails/ProviderDetails";
import { ProviderAppointments } from "./components/Appointments/ProviderAppointments";
import { ProviderAvailability } from "./components/Availability/ProviderAvailability";
import { Footer } from "./components/Partials/Footer/Footer";
import { AppointmentBookingPage } from "./components/Appointments/AppointmentBookingPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClientEditForm from './components/ClientEditForm/ClientEditForm';
import ProviderEditForm from './components/ProviderEditForm/ProviderEditForm';



const App = () => {
  const { user, handleSignOut } = useAuth();

  const renderNavBar = () => {
    if (!user) return <NavBar handleSignOut={handleSignOut} />;
    if (user.type === "provider")
      return <ProviderNavBar handleSignOut={handleSignOut} />;
    return <ClientNavBar handleSignOut={handleSignOut} />;
  };

  return (
    <>
      {renderNavBar()}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

<Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/register/client" element={<ClientSignupForm />} />
    <Route path="/register/provider" element={<ProviderSignupForm />} />
    <Route path="/login" element={<SigninForm />} />
    
    {/* Protected Client Routes */}
    <Route
        path="/client/dashboard"
        element={
            <ProtectedRoute allowedUserTypes={["client"]}>
                <ClientDashboard />
            </ProtectedRoute>
        }
    />
    <Route
        path="/client/profile"
        element={
            <ProtectedRoute allowedUserTypes={["client"]}>
                <ClientEditForm />
            </ProtectedRoute>
        }
    />

    {/* Protected Provider Routes */}
    <Route
        path="/provider/dashboard"
        element={
            <ProtectedRoute allowedUserTypes={["provider"]}>
                <ProviderDashboard />
            </ProtectedRoute>
        }
    />
    <Route
        path="/provider/appointments"
        element={
            <ProtectedRoute allowedUserTypes={["provider"]}>
                <ProviderAppointments />
            </ProtectedRoute>
        }
    />
    <Route
        path="/provider/availability"
        element={
            <ProtectedRoute allowedUserTypes={["provider"]}>
                <ProviderAvailability />
            </ProtectedRoute>
        }
    />
    <Route 
        path="/provider/profile" 
        element={
            <ProtectedRoute allowedUserTypes={["provider"]}>
                <ProviderEditForm />
            </ProtectedRoute>
        }
    />
    <Route path="/providerlist" element={<ProviderList />} />
    <Route path="/providerlist/:providerId" element={<ProviderDetails isModal={false}/>} />
    <Route
        path="/book-appointment/:providerId"
        element={
            <ProtectedRoute allowedUserTypes={["client"]}>
                <AppointmentBookingPage />
            </ProtectedRoute>
        }
    />
</Routes>

      <Footer />
    </>
  );

};

export default App;