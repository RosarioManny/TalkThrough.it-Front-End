import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as authService from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

export const SigninForm = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [message, setMessage] = useState(['']);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'client'
  });

  const updateMessage = (msg) => {
    setMessage(msg);
  };

  const handleChange = (e) => {
    updateMessage('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authService.signin(formData);
      
      if (response && response.user) {
        setUser(response.user);
        // Navigate based on user type
        if (formData.userType === 'provider') {
          navigate('/provider/dashboard');
        } else {
          navigate('/client/dashboard');
        }
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Signin error:', err);
      // Custom error messages based on user type and error status
      if (err.response?.status === 401) {
        updateMessage(
          formData.userType === 'provider' 
            ? 'Provider not registered' 
            : 'Client not registered'
        );
      } else {
        updateMessage('An error occurred during sign in. Please try again.');
      }
    }
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Log In</h1>
      {message && (
        <p className="text-red-500 mb-4 p-3 bg-red-50 rounded-md border border-red-200">
          {message}
        </p>
      )}
      <form autoComplete="off" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-2">E-mail:</label>
          <input
            type="email"
            autoComplete="off"
            id="email"
            value={formData.email}
            name="email"
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-2">Password:</label>
          <input
            type="password"
            autoComplete="off"
            id="password"
            value={formData.password}
            name="password"
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="userType" className="block mb-2">
            Please select if you are a client or a provider:
          </label>
          <select 
            onChange={handleChange} 
            name="userType"  
            id="userType"
            value={formData.userType}
            required
            className="w-full p-2 border rounded"
          >
            <option value="client">Client</option>
            <option value="provider">Provider</option>
          </select>
        </div>
              
        <div className="flex gap-4">
          <button 
            type="submit" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
          >
            Log In
          </button>
          <Link to="/">
            <button 
              type="button" 
              className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded transition-colors"
            >
              Cancel
            </button>
          </Link>
        </div>
      </form>
    </main>
  );
};
