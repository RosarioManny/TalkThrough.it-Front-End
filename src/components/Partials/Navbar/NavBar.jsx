import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { theme } from "../../../styles/theme";

export const NavBar = () => {
  const { user, handleSignOut } = useAuth();

  return (
    <nav className={theme.nav.wrapper}>
      <div className={`${theme.layout.container} flex justify-between items-center`}>
        <Link
          to="/"
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
          {!user ? (
            <>
              <Link
                to="/login"
                className={theme.text.nav}
              >
                Login
              </Link>
              <div className="relative group">
                <button className={`${theme.text.nav} pb-2`}>
                  Sign Up
                </button>
                <div className={theme.nav.dropdown}>
                  <div className="absolute h-2 -top-2 left-0 right-0"></div>
                  <div className={theme.card.default}>
                    <Link
                      to="/register/client"
                      className={theme.nav.dropdownItem}
                    >
                      Sign Up as Client
                    </Link>
                    <Link
                      to="/register/provider"
                      className={theme.nav.dropdownItem}
                    >
                      Sign Up as Provider
                    </Link>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <button
              onClick={handleSignOut}
              className={theme.text.nav}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
