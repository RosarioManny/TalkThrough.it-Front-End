import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const NavBar = () => {
    const { user, handleSignOut } = useAuth();

    return (
        <nav className="bg-blue-600 p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-white text-xl font-bold">
                    TalkThrough.it
                </Link>
                <div className="flex items-center space-x-6">
                    <Link 
                        to="/providerlist" 
                        className="text-white hover:text-blue-200 transition-colors"
                    >
                        Find Providers
                    </Link>
                    {!user ? (
                        <>
                            <Link 
                                to="/login" 
                                className="text-white hover:text-blue-200 transition-colors"
                            >
                                Login
                            </Link>
                            <div className="relative group">
                                <button className="text-white hover:text-blue-200 transition-colors">
                                    Sign Up
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                                    <Link 
                                        to="/register/client" 
                                        className="block px-4 py-2 text-gray-800 hover:bg-blue-50"
                                    >
                                        Sign Up as Client
                                    </Link>
                                    <Link 
                                        to="/register/provider" 
                                        className="block px-4 py-2 text-gray-800 hover:bg-blue-50"
                                    >
                                        Sign Up as Provider
                                    </Link>
                                </div>
                            </div>
                        </>
                    ) : (
                        <button 
                            onClick={handleSignOut}
                            className="text-white hover:text-blue-200 transition-colors"
                        >
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
