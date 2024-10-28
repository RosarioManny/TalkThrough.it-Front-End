import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as authService from '../../services/authService';

const SignupForm = (props) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState(['']);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    passwordConf: '',
    location: '',
    insuranceProvider: '',
    therapyGoals: '',
  });

  const updateMessage = (msg) => {
    setMessage(msg);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newUserResponse = await authService.signup(formData);
      props.setUser(newUserResponse.user);
      navigate('/');
    } catch (err) {
      updateMessage(err.message);
    }
  };

  const { username, password, passwordConf, location, insuranceProvider, therapyGoals} = formData;

  const isFormInvalid = () => {
    return !(username && password && password === passwordConf);
  };

  return (
    <main>
      <h1>Sign Up</h1>
      <p>{message}</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="name"
            value={username}
            name="username"
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

export default SignupForm;