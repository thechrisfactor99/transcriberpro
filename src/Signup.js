import React, { useState } from "react";
import { Link } from "react-router-dom";
import Amplify, { API, graphqlOperation, Auth, Analytics } from 'aws-amplify';

import MaskedInput from 'react-text-mask'


function Signup(props) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");  
  const [newUser, setNewUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState("")
  const [primaryContact, setPrimaryContact] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [zip, setZip] = useState("")
  const [id, setId] = useState("")

  const [state, setState] =useState("")

  function validateForm() {
    return (
      email.length > 0 &&
      password.length > 0 &&
      password === confirmPassword
    );
  }

  function validateConfirmationForm() {
    return confirmationCode.length > 0;
  }

async function handleSubmit(event) {
  event.preventDefault();

  setIsLoading(true);

  if((email == "") || (password == "")){
    alert("Fields cannot be empty")
  }
  else{
    try {
      console.log('signing up...')
      const newUser = await Auth.signUp({
        username: email,
        password: password
      });
      setIsLoading(false);
      setNewUser(newUser);
      const createAccount = await API.graphql(graphqlOperation(
            `mutation create {
              createAccount(input: {id: "${newUser.userSub}", email: "${email}", accountType: "user", stripe_id: "", time_balance: "${60}"}){
                id
                email
                accountType
                stripe_id
                time_balance
              }
            }`))
      console.log(createAccount)

      await Auth.signIn(email, password);

    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }

      let username 
      username = await Auth.currentAuthenticatedUser()
        .then(user => {
          setId(user.username)
          console.log(user)
          return user.username
        })

      props.history.push("/");
  }
}

async function handleConfirmationSubmit(event) {
  event.preventDefault();

  setIsLoading(true);

  let username
  try {
    await Auth.confirmSignUp(email, confirmationCode);
    await Auth.signIn(email, password);

    username = await Auth.currentAuthenticatedUser()
      .then(user => {
        setId(user.username)
        console.log(user)
        return user.username
      })

    props.userHasAuthenticated(true);
    props.setUser("")
    //props.history.push("/login");
  } catch (e) {
    alert(e.message);
    setIsLoading(false);
  }

  props.history.push("/login");
}

  function renderConfirmationForm() {
    return (
        <form onSubmit={handleConfirmationSubmit} className="card my-8 p-8 bg-white border rounded-lg w-2/3 mx-auto ">
          <h1 className="text-2xl">Create Account</h1>
          <div className="flex">
          <div className="w-full flex flex-col">
            <div className="flex my-4 w-full">
              <p className="my-auto pr-4">Confirmation Code:</p>
              <input className="border w-1/4" type="text" onChange ={e => setConfirmationCode(e.target.value)} value={confirmationCode}></input>
            </div>
          </div>
        </div>
        <p>Please check your email for the code.</p>
        <button className="px-6 py-2 bg-blue-500 text-white rounded-sm">Submit</button>
        </form>
    );
  }


  function renderForm() {
    return (
      <div className="w-full h-full">
        <form onSubmit={handleSubmit} className="my-8 p-8 bg-white w-5/6 mx-auto ">
          <h1 className="text-2xl">Create Account</h1>
          <div className="flex">
          <div className="w-1/2 flex flex-col">
            <div className="flex my-4 w-full">
              <p className="my-auto pr-4 w-1/3 text-right">Name:</p>
              <input type="name" name="name" value={name} onChange={e => setName(e.target.value)} className="border w-1/2"/><br/>
            </div>
            <div className="flex my-4 w-full">
              <p className="my-auto pr-4 w-1/3 text-right">Email:</p>
              <input type="email" name="email" value={email} onChange={e => setEmail(e.target.value)} className="border w-1/2"/><br/>
            </div>
            <div className="flex my-4 w-full ">
              <p className="my-auto pr-4 w-1/3 text-right">Password:</p>
              <input className="border w-1/2" type="password" name="password" value={password} onChange={e => setPassword(e.target.value)} /><br />
            </div>
            <div className="flex my-4 w-full">
              <p className="my-auto pr-4 w-1/3 text-right">Confirm Password:</p>
              <input className="border w-1/2" type="password" name="confirmPassword" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} /><br />
            </div>
          </div>
          </div>
        <button className="px-6 py-2 bg-blue-500 text-white rounded-sm">Create</button>
        <p>Already have an account? <Link className="text-blue-700" to="/login">Sign In</Link></p>
        </form>
      </div>
    );
  }





  return (
    <div className="Signup">
      {renderForm()}
    </div>
  );
}

export default Signup