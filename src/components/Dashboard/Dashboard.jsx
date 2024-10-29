import React from 'react';
import ClientDashboard from './ClientDashboard';
import ProviderDashboard from './ProviderDashboard';

const Dashboard = ({ userType }) => {
  // This will eventually come from authentication context
  // const userType = useAuth().user?.type;

  return (
    <div>
      {userType === 'provider' ? (
        <ProviderDashboard />
      ) : (
        <ClientDashboard />
      )}
    </div>
  );
};

export default Dashboard;
