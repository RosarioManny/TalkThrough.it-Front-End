// taken from jwt-auth tutorial/uses axios - Gabe

import axios from "axios";
const BACKEND_URL = 'http://localhost:3000'; // this is our Express API url, would change later for production.

const signup = async (formData) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/users/signup`,formData)
    console.log(res.data)

    localStorage.setItem('token',res.data.token)

    return res
  } catch (err) {
    console.log(err);
    throw err; //throws error  in the form
  }
};

const signin = async (clientData) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/clients/signin`,clientData)
    console.log(res.data)

    if (res.data.error){
      throw new Error(res.data.error)
    }

    if(res.data.token){
      localStorage.setItem('token',res.data.token)

      const client = JSON.parse(atob(res.data.token.split('.')[1])) //atob is decryption native to js. res.data.token instead of json.token
      return client
    }

  } catch (error) {
    console.log(error)
    throw error
  }
}

const getClient = () => {
  const token = localStorage.getItem('token')
  if (!token) return null
  const client = JSON.parse(atob(token.split('.')[1]))
  return client
}

const signOut = () => {
  localStorage.removeItem('token');
}


export { // or put export next to each variable
  signup, signin, getClient, signOut
};