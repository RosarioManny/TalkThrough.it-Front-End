import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { theme } from "../../../styles/theme";

export const NavBar = () => {
  const { user, handleSignOut } = useAuth();

  return (
    <nav className="bg-prussian_blue-500 p-4 shadow-lg fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-opacity-96">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link
          to="/"
          className="text-alice_blue-500 text-xl font-bold hover:text-celestial_blue-300 transition-all duration-300"
        >
          TalkThrough.it
        </Link>
        <div className="flex items-center gap-6">
          <Link
            to="/providerlist"
            className="text-alice_blue-500 hover:text-celestial_blue-300 transition-all duration-300 flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Find Providers
          </Link>

          {!user ? (
            <>
              <Link
                to="/login"
                className="text-alice_blue-500 hover:text-celestial_blue-300 transition-all duration-300 flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                Login
              </Link>
              <div className="relative group">
                <button className="text-alice_blue-500 hover:text-celestial_blue-300 transition-all duration-300 flex items-center gap-2 py-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                  Sign Up
                  <svg
                    className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div className="absolute top-full right-0 w-56 pt-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-y-0 translate-y-2">
                  <div className="bg-white rounded-xl shadow-lg border border-alice_blue-200 overflow-hidden">
                    <Link
                      to="/register/client"
                      className="flex items-center gap-2 px-4 py-3 text-prussian_blue-500 hover:bg-alice_blue-50 transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Sign Up as Client
                    </Link>
                    <Link
                      to="/register/provider"
                      className="flex items-center gap-2 px-4 py-3 text-prussian_blue-500 hover:bg-alice_blue-50 transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Sign Up as Provider
                    </Link>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <button
              onClick={handleSignOut}
              className="text-alice_blue-500 hover:text-celestial_blue-300 transition-all duration-300 flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
