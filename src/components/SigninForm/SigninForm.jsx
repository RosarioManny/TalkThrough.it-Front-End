//taken from hoot front end  --gabe

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as authService from '../../services/authService';

const SigninForm = (props) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState(['']);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'Client',
  });

  const updateMessage = (msg) => {
    setMessage(msg);
  };

  const handleChange = (e) => {
    updateMessage('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log(formData)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData)
    try {
      const user = await authService.signin(formData);
      // console.log(user);
      props.setUser(user);
      navigate('/');
    } catch (err) {
      updateMessage(err.message);
    }
  };

  return (
    <main>
      <h1>Log In</h1>
      {/* TODO: I believe the first field is e-mail, but afterwards it's password then client type in the backend, should create a radial button or something to let the user pick either one, and also how to check this on the backend? -gabe 
      
      example working on postman:
      {
        "email": "thisisatest@test.test", 
        "password": "therock",
        "userType": "client"
      }
      
      */}
      <p>{message}</p>
      <form autoComplete="off" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">E-mail:</label>
          <input
            type="text"
            autoComplete="off"
            id="email"
            value={formData.username}
            name="email"
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            autoComplete="off"
            id="password"
            value={formData.password}
            name="password"
            onChange={handleChange}
          />
        </div>
        {/* TODO: put client or provider selection here --backend: auth.js line 128-- Gabe */}
        <label htmlFor="userType">Please select if you are a client or a provider:</label>
        <select 
          onChange={handleChange} 
          name="userType"  
          id="userType"
          value={formData.userType}
          required
        >
            <option value="client">
              Client
            </option>
            <option value="Provider">
              Provider
            </option>
        </select>
              
        <div>
          <button>Log In</button>
          <Link to="/">
            <button>Cancel</button>
          </Link>
        </div>
      </form>
    </main>
  );
};

export default SigninForm;