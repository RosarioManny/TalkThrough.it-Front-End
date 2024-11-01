import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signin } from "../../services/authService"; 
import { useAuth } from "../../context/AuthContext";
import { toast } from 'react-toastify'

export const SigninForm = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: "client",
  });

  const updateMessage = (msg) => {
    setMessage(msg);
  };

  const handleChange = (e) => {
    updateMessage("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
      const response = await signin({
          email: formData.email,
          password: formData.password,
          userType: formData.userType
      });

      if (response.error) {
          toast.error(response.error);
          setFormData(prev => ({
              ...prev,
              password: ''
          }));
          return; 
      }

      if (response.user) {
          setUser(response.user);
          toast.success('Successfully signed in!');
          navigate(`/${formData.userType}/dashboard`);
      }
  } catch (error) {
      console.error('Unexpected signin error:', error);
      toast.error('An unexpected error occurred');
      setFormData(prev => ({
          ...prev,
          password: ''
      }));
  }
};


  return (
    <main className="min-h-screen bg-alice_blue-500 pt-28 pb-16 px-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-prussian_blue-500 mb-2">
            Welcome Back
          </h1>
          <p className="text-prussian_blue-400">
            Sign in to continue your journey
          </p>
        </div>

        {message && message.length > 0 && (
          <div className="mb-6 p-4 rounded-lg bg-sunglow-50 border-l-4 border-sunglow-500 flex items-center gap-3">
            <svg
              className="w-5 h-5 text-sunglow-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="text-sm text-sunglow-700">{message}</p>
          </div>
        )}

        <form autoComplete="off" onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-prussian_blue-500 mb-2"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-prussian_blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2.5 border border-alice_blue-200 rounded-lg focus:ring-2 focus:ring-celestial_blue-500 focus:border-celestial_blue-500 transition-colors duration-200"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-prussian_blue-500 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-prussian_blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2.5 border border-alice_blue-200 rounded-lg focus:ring-2 focus:ring-celestial_blue-500 focus:border-celestial_blue-500 transition-colors duration-200"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="userType"
              className="block text-sm font-medium text-prussian_blue-500 mb-2"
            >
              I am a:
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-prussian_blue-400"
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
              </div>
              <select
                id="userType"
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2.5 border border-alice_blue-200 rounded-lg focus:ring-2 focus:ring-celestial_blue-500 focus:border-celestial_blue-500 transition-colors duration-200"
                required
              >
                <option value="client">Client</option>
                <option value="provider">Provider</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-celestial_blue-500 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-celestial_blue-500/20 flex items-center justify-center gap-2"
            >
              <span>Sign In</span>
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
            <Link to="/" className="flex-1">
              <button
                type="button"
                className="w-full bg-white text-prussian_blue-500 px-6 py-3 rounded-lg font-medium border border-alice_blue-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-prussian_blue-500/10"
              >
                Cancel
              </button>
            </Link>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-prussian_blue-400 mb-2">
            Don't have an account?
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/register/client"
              className="text-celestial_blue-500 hover:text-celestial_blue-600 font-medium flex items-center gap-1"
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
              Sign up as Client
            </Link>
            <span className="text-prussian_blue-300">or</span>
            <Link
              to="/register/provider"
              className="text-celestial_blue-500 hover:text-celestial_blue-600 font-medium flex items-center gap-1"
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
              Sign up as Provider
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};
