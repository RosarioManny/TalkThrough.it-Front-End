import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const ClientNavBar = () => {
    const { user, handleSignOut } = useAuth();

    return (
        <nav className="bg-blue-600 p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/client/dashboard" className="text-white text-xl font-bold">
                    TalkThrough.it
                </Link>
                <div className="flex items-center space-x-6">
                    <Link 
                        to="/providerlist" 
                        className="text-white hover:text-blue-200 transition-colors"
                    >
                        Find Providers
                    </Link>
                    <Link 
                        to="/client/dashboard" 
                        className="text-white hover:text-blue-200 transition-colors"
                    >
                        Dashboard
                    </Link>
                    <div className="relative group">
                        <button className="text-white hover:text-blue-200 transition-colors">
                            {user?.firstName || 'Profile'}
                        </button>
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                            <Link 
                                to="/client/profile" 
                                className="block px-4 py-2 text-gray-800 hover:bg-blue-50"
                            >
                                Edit Profile
                            </Link>
                            <button 
                                onClick={handleSignOut}
                                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-50"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default ClientNavBar;
