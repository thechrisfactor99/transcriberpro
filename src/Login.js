import React, { useState } from "react";
import { Auth } from 'aws-amplify';
import { Link } from "react-router-dom";

import Input from './components/Input'


function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /*function validateForm() {
    return email.length > 0 && password.length > 0;
  }*/

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await Auth.signIn(email.toLowerCase(), password);
      props.userHasAuthenticated(true);
      props.history.push("/");

    } catch (e) {
      alert(e.message);

  }
}

/*  const handleForgotPassword = () =>{
    Auth.forgotPassword("785aa854-0952-4fd3-9612-c862c25ac54c")
        .then(data => console.log(data))
        .catch(err => console.log(err));
  }*/

  return (
    <div className="w-full h-full">
        <form className="my-8 p-8 bg-white rounded-lg w-2/3 mx-auto ">
          <h1 className="text-3xl">Sign In</h1>
          <div className="flex">
          <div className="w-full md:w-1/2 flex flex-col">
            <div className="flex flex-col md:flex-row my-4 w-full">
              <p className="my-auto pr-4 w-1/3 md:text-right">Email:</p>
              <input onChange={e => setEmail(e.target.value)} value={email} type="email" name="email" className="w-full border md:w-2/3"/><br/>
            </div>
            <div className="flex flex-col md:flex-row my-4 w-full">
              <p className="my-auto pr-4 w-1/3 md:text-right">Password:</p>
              <input onChange={e => setPassword(e.target.value)} value={password} type="password" name="password" className="w-full border md:w-2/3"/><br />
            </div>
          </div>
          </div>
          <button onClick={handleSubmit} className="mb-2 px-6 py-2 bg-blue-500 text-white rounded-sm">Sign In</button>
          <p>Don't have an account? <Link className="text-blue-700" to="/signup">Sign up</Link></p>
          <p><Link className="text-blue-700" to="/login/reset">Forgot password?</Link></p>

        </form>
    </div>
    )
  }

export default Login
