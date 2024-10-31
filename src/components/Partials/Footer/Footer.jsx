import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-prussian_blue-500 text-alice_blue-500 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-celestial_blue-300 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              TalkThrough.it
            </h3>
            <p className="text-alice_blue-400 text-sm leading-relaxed">
              Making mental healthcare accessible and personal. Connect with qualified providers and take control of your mental health journey.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-celestial_blue-300">
              Quick Links
            </h4>
            <div className="flex flex-col space-y-3">
              {[
                { to: "/about", label: "About Us" },
                { to: "/providerlist", label: "Find Providers" },
                { to: "/register/provider", label: "Join as Provider" },
              ].map((link) => (
                <Link 
                  key={link.to}
                  to={link.to} 
                  className="text-alice_blue-400 hover:text-celestial_blue-300 transition-all duration-300 flex items-center gap-2 group"
                >
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Connect Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-celestial_blue-300">
              Connect With Us
            </h4>
            <div className="space-y-3">
              <p className="text-sm text-alice_blue-400">
                Created by:
              </p>
              <p className="text-sm text-alice_blue-400">
                Timothy Lim, Emmanuel Rosario,
                <br />
                Joey Pierre & Gabe Gutierrez
              </p>
              <div className="flex gap-4 mt-6">
                {[
                  {
                    to: "https://github.com/RosarioManny/TalkThrough.it-Front-End/tree/er-Navbar",
                    label: "Frontend"
                  },
                  {
                    to: "https://github.com/Nottimlim/TalkThroughIt-Backend",
                    label: "Backend"
                  }
                ].map((link) => (
                  <Link 
                    key={link.to}
                    to={link.to}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-prussian_blue-600 text-alice_blue-400 hover:bg-prussian_blue-700 hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" clipRule="evenodd"/>
                    </svg>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-prussian_blue-400">
          <p className="text-center text-sm text-alice_blue-400">
            TalkThrough.it © {new Date().getFullYear()}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

