import React, { useState } from 'react';
import { signupProvider } from '../../services/authService';

const ProviderSignupForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '', firstName: '', lastName: '', credentials: '', bio: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signupProvider(formData);
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
      <input type="text" name="credentials" value={formData.credentials} onChange={handleChange} placeholder="Credentials" />
      <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Bio"></textarea>
      {error && <p>{error}</p>}
      <button type="submit">Sign Up as Provider</button>
    </form>
  );
};

export default ProviderSignupForm;
