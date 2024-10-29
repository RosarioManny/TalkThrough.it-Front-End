import React from 'react';
import { useAuth } from '../../context/AuthContext'; // Import useAuth hook
import ClientDashboard from './ClientDashboard';
import ProviderDashboard from './ProviderDashboard';

const Dashboard = () => {
  const { user } = useAuth(); // Get user from context

  return (
    <div>
      {user?.type === 'provider' ? (
        <ProviderDashboard />
      ) : (
        <ClientDashboard />
      )}
    </div>
  );
};

export default Dashboard;
