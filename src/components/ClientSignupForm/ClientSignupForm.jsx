import React, { useState } from 'react';
import { signupClient } from '../../services/authService';
import {Link} from 'react-router-dom'
const ClientSignupForm = () => {
  const [formData, setFormData] = useState({  
    email:'',
    firstName: '',
    lastName: '',
    password: '',
    passwordConf: '',
    location: '',
    insuranceProvider: '',
    therapyGoals: '', });
    const [message, setmessage]= useState([''])
  
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
  const { email, firstName, lastName, password, passwordConf, location, insuranceProvider, therapyGoals} = formData;

  const isFormInvalid = () => {
    return !(firstName && password && password === passwordConf);
  };

  return (
    <main>
      <h1>Sign Up</h1>
      <p>{message}</p>
      <form onSubmit={handleSubmit}>
      <div>
          <label htmlFor="email">email:</label>
          <input
            type="email"
            id="email"
            value={email}
            name="email"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="firstName">firstName:</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            name="firstName"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="lastName">lastName:</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            name="lastName"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            name="password"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="confirm">Confirm Password:</label>
          <input
            type="password"
            id="confirm"
            value={passwordConf}
            name="passwordConf"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="location">Location:</label>
          <input
            type="text"
            id="location"
            value={location}
            name="location"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="insuranceProvider">Insurance Provider:</label>
          <select 
            onChange={handleChange} 
            name="insuranceProvider"  
            id="insuranceProvider"
            value={insuranceProvider}
            required
          >
            <option value="Aetna">
            Aetna
            </option>
            <option value="United Health Care">
            United Health Care
            </option>
            <option value="Blue Cross / Blue Shield">
            Blue Cross / Blue Shield
            </option>
            <option value="Humana">
            Humana
            </option>
            <option value="Fidelis Care">
            Fidelis Care
            </option>
            <option value="Health Plus One">
            Health Plus One
            </option>
          </select>
        </div>
        <div>
          <label htmlFor="therapyGoals">Therapy Goals: </label>
          <textarea 
          name="therapyGoals" 
          id="therapyGoals" 
          onChange={handleChange} 
          value={therapyGoals}
          >
          </textarea>
        </div>
        <div>
          <button disabled={isFormInvalid()}>Sign Up</button>
          <Link to="/">
            <button>Cancel</button>
          </Link>
        </div>
      </form>
    </main>
  );
};

export default ClientSignupForm;
