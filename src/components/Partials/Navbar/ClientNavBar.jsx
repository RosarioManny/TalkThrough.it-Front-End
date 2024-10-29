import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const ClientNavBar = () => {
  const { user, setUser } = useAuth();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    // You might want to navigate to home here
  };

  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/client/dashboard" className="text-white text-xl font-bold">
          TalkThrough.it
        </Link>
        <div className="space-x-4">
          <Link to="/providerlist" className="text-white">
            Find Providers
          </Link>
          <Link to="/client/dashboard" className="text-white">
            My Dashboard
          </Link>
          <button onClick={handleLogout} className="text-white">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default ClientNavBar;
