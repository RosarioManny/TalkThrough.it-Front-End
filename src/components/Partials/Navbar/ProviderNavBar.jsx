import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { theme } from "../../../styles/theme";

export const ProviderNavBar = () => {
  const { user, handleSignOut } = useAuth();

  return (
    <nav className="bg-prussian_blue-500 p-4 shadow-lg fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link
          to="/provider/dashboard"
          className="text-alice_blue-500 text-xl font-bold hover:text-celestial_blue-300 transition-all duration-300"
        >
          TalkThrough.it
        </Link>
        <div className="flex items-center gap-6">
          {/* Dashboard Link */}
          <Link
            to="/provider/dashboard"
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
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
            Dashboard
          </Link>

          {/* Appointments Link */}
          <Link
            to="/provider/appointments"
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Appointments
          </Link>

          {/* Profile Dropdown */}
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
                  d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-medium">
                Dr. {user?.lastName || "Profile"}
              </span>
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

            {/* Dropdown Menu */}
            <div className="absolute top-full right-0 w-56 pt-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-y-0 translate-y-2">
              <div className="bg-white rounded-xl shadow-lg border border-alice_blue-200 overflow-hidden">
                <Link
                  to="/provider/profile"
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit Profile
                </Link>
                <Link
                  to="/provider/availability"
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Manage Availability
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-4 py-3 text-prussian_blue-500 hover:bg-alice_blue-50 transition-all duration-300 hover:-translate-y-0.5"
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
