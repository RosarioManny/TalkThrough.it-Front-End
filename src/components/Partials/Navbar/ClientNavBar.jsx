import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { theme } from "../../../styles/theme";

export const ClientNavBar = () => {
  const { user, handleSignOut } = useAuth();

  return (
    <nav className={theme.nav.wrapper}>
      <div className={`${theme.layout.container} flex justify-between items-center`}>
        <Link 
          to="/client/dashboard" 
          className={`${theme.text.nav} text-xl font-bold`}
        >
          TalkThrough.it
        </Link>
        <div className="flex items-center space-x-6">
          <Link
            to="/providerlist"
            className={theme.text.nav}
          >
            Find Providers
          </Link>
          <Link
            to="/client/dashboard"
            className={theme.text.nav}
          >
            Dashboard
          </Link>
          <div className="relative group">
            <button className={`${theme.text.nav} pb-2 flex items-center`}>
              <span>{user?.firstName || "Profile"}</span>
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className={theme.nav.dropdown}>
              <div className="absolute h-2 -top-2 left-0 right-0"></div>
              <div className={theme.card.default}>
                <Link
                  to="/client/profile"
                  className={theme.nav.dropdownItem}
                >
                  Edit Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className={theme.nav.dropdownItem}
                >
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