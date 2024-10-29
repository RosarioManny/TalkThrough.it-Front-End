import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const ProviderNavBar = () => {
  const { user, setUser } = useAuth();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    // You might want to navigate to home here
  };

  return (
    <nav className="bg-green-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/provider/dashboard" className="text-white text-xl font-bold">
          TalkThrough.it
        </Link>
        <div className="space-x-4">
          <Link to="/provider/dashboard" className="text-white">
            My Dashboard
          </Link>
          <Link to="/provider/appointments" className="text-white">
            Appointments
          </Link>
          <Link to="/provider/availability" className="text-white">
            Manage Availability
          </Link>
          <button onClick={handleLogout} className="text-white">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default ProviderNavBar;
