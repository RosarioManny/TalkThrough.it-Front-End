import React, { useState } from 'react';
import { signupClient } from '../../services/authService';

const ClientSignupForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '', firstName: '', lastName: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signupClient(formData);
      // Handle successful signup (e.g., redirect to login)
    } catch (err) {
      setError('Signup failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" />
      <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" />
      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
      <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" />
      {error && <p>{error}</p>}
      <button type="submit">Sign Up as Client</button>
    </form>
  );
};

export default ClientSignupForm;
