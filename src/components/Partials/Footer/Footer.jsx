import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-prussian_blue-500 text-alice_blue-500 py-8 mt-auto">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-celestial_blue-300">
                            TalkThrough.it
                        </h3>
                        <p className="text-alice_blue-400 text-sm">
                            Making mental healthcare accessible and personal.
                        </p>
                    </div>

                    {/* Links Section */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-celestial_blue-300">
                            Quick Links
                        </h4>
                        <div className="flex flex-col space-y-2">
                            <Link 
                                to="/about" 
                                className="text-alice_blue-400 hover:text-celestial_blue-300 transition-colors duration-200 text-sm"
                            >
                                About Us
                            </Link>
                            <Link 
                                to="/providerlist" 
                                className="text-alice_blue-400 hover:text-celestial_blue-300 transition-colors duration-200 text-sm"
                            >
                                Find Providers
                            </Link>
                            <Link 
                                to="/register/provider" 
                                className="text-alice_blue-400 hover:text-celestial_blue-300 transition-colors duration-200 text-sm"
                            >
                                Join as Provider
                            </Link>
                        </div>
                    </div>

                    {/* Contact & Social */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-celestial_blue-300">
                            Connect With Us
                        </h4>
                        <div className="space-y-2">
                            <p className="text-sm text-alice_blue-400">
                                Created by:
                            </p>
                            <p className="text-sm text-alice_blue-400">
                                Timothy Lim, Emmanuel Rosario,
                                <br />
                                Joey Pierre & Gabe Gutierrez
                            </p>
                        </div>
                        <div className="flex space-x-4 mt-4">
                            <Link 
                                to="https://github.com/RosarioManny/TalkThrough.it-Front-End/tree/er-Navbar"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-alice_blue-400 hover:text-celestial_blue-300 transition-colors duration-200"
                            >
                                <span className="flex items-center space-x-2">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" clipRule="evenodd"/>
                                    </svg>
                                    <span className="text-sm">Frontend</span>
                                </span>
                            </Link>
                            <Link 
                                to="https://github.com/Nottimlim/TalkThroughIt-Backend"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-alice_blue-400 hover:text-celestial_blue-300 transition-colors duration-200"
                            >
                                <span className="flex items-center space-x-2">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" clipRule="evenodd"/>
                                    </svg>
                                    <span className="text-sm">Backend</span>
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 pt-8 border-t border-prussian_blue-400">
                    <p className="text-center text-sm text-alice_blue-400">
                        TalkThrough.it © {new Date().getFullYear()}. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
