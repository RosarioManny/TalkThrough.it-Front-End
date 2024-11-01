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
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  ),
                  title: "Personalized Care",
                  description:
                    "Find therapists who specialize in your specific needs and concerns",
                },
                {
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  ),
                  title: "Safe Space",
                  description:
                    "Experience therapy in a judgment-free, supportive environment",
                },
                {
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  ),
                  title: "Healing Journey",
                  description:
                    "Start your path to emotional wellness with expert guidance",
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
