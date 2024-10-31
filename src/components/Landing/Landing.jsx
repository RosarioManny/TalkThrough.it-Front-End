import React from "react";
import { Link } from "react-router-dom";
import landingBg from "../../assets/images/landing-bg.jpg";

export const Landing = () => {
  return (
    <main className="min-h-screen relative p-20">
      {/* Background */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${landingBg})`,
        }}
      >
        <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            {/* Hero Section */}
            <div className="animate-fadeIn">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight animate-slideDown">
                <span className="text-alice_blue-600 drop-shadow-[0_4px_3px_rgba(19,41,61,0.3)]">
                  Welcome to{" "}
                </span>
                <span className="text-sunglow-600 drop-shadow-[0_4px_3px_rgba(255,203,71,0.3)]">
                  TalkThrough.it
                </span>
              </h1>

              <h3 className="text-xl md:text-2xl text-prussian_blue-500 mb-12 leading-relaxed animate-slideUp drop-shadow-[0_2px_2px_rgba(19,41,61,0.2)]">
                Connect with mental health professionals who understand your
                journey.
                <br className="hidden md:block" />
                Start your path to wellness today.
              </h3>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 animate-fadeIn">
                <Link
                  to="/register/client"
                  className="group bg-celestial_blue-500 text-white px-8 py-4 text-lg rounded-xl transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-celestial_blue-500/20 flex items-center justify-center gap-2 drop-shadow-[0_4px_3px_rgba(27,152,224,0.3)]"
                >
                  <span>Get Started</span>
                  <svg
                    className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
                <Link
                  to="/providerlist"
                  className="group bg-white text-prussian_blue-500 px-8 py-4 text-lg rounded-xl transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-prussian_blue-500/20 flex items-center justify-center gap-2 drop-shadow-[0_4px_3px_rgba(19,41,61,0.2)]"
                >
                  <span>Browse Providers</span>
                  <svg
                    className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
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
                </Link>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 mt-24 animate-slideUp">
              {[
                {
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                    />
                  ),
                  title: "Virtual Sessions",
                  description:
                    "Connect with therapists from the comfort of your home",
                },
                {
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  ),
                  title: "Secure Platform",
                  description: "Private and confidential communication",
                },
                {
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  ),
                  title: "Flexible Scheduling",
                  description: "Book appointments that fit your schedule",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group bg-white/90 backdrop-blur-sm rounded-xl p-8 transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl hover:bg-white drop-shadow-[0_4px_6px_rgba(19,41,61,0.15)]"
                >
                  <div className="text-celestial_blue-500 mb-4 transform transition-transform duration-300 group-hover:scale-110">
                    <svg
                      className="w-12 h-12 mx-auto drop-shadow-[0_2px_2px_rgba(27,152,224,0.2)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {feature.icon}
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-prussian_blue-500 mb-2 transition-colors duration-300 group-hover:text-celestial_blue-500 drop-shadow-[0_2px_1px_rgba(19,41,61,0.1)]">
                    {feature.title}
                  </h3>
                  <p className="text-prussian_blue-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
