import React from 'react';
import { Link } from 'react-router-dom';
import { theme } from '../../styles/theme';
import landingBg from '../../assets/images/landing-bg.jpg'; 

export const Landing = () => {
  return (
    <main className="min-h-screen relative">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${landingBg})`,
        }}
      >
        <div className="absolute inset-0 bg-prussian_blue-500/30"></div>
      </div>

        {/* Content */}
        <div className="relative z-10 min-h-screen flex items-center">
          <div className="container mx-auto px-4 py-24">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              {/* logo here ?*/}
              <div className="mb-12">
                {/* maybe logo here */}
              </div>

              {/* Main Content */}
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Welcome to TalkThrough.it
              </h1>
              
              <h3 className="text-xl md:text-2xl text-alice_blue-500 mb-12 leading-relaxed">
                Connect with mental health professionals who understand your journey. 
                Start your path to wellness today.
              </h3>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                <Link 
                  to="/register/client" 
                  className={`${theme.button.primary} px-8 py-4 text-lg rounded-md transform transition-transform duration-200 hover:scale-105`}
                >
                  Get Started
                </Link>
                <Link 
                  to="/providerlist" 
                  className="bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white px-8 py-4 text-lg rounded-md transform transition-transform duration-200 hover:scale-105 hover:bg-white/20"
                >
                  Browse Providers
                </Link>
              </div>

              {/* Additional Features Section */}
              <div className="grid md:grid-cols-3 gap-8 mt-24">
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                  <div className="text-celestial_blue-300 mb-4">
                    {/* Icon */}
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Virtual Sessions
                  </h3>
                  <p className="text-alice_blue-300">
                    Connect with therapists from the comfort of your home
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                  <div className="text-celestial_blue-300 mb-4">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Secure Platform
                  </h3>
                  <p className="text-alice_blue-300">
                    Private and confidential communication
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                  <div className="text-celestial_blue-300 mb-4">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Flexible Scheduling
                  </h3>
                  <p className="text-alice_blue-300">
                    Book appointments that fit your schedule
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
};

