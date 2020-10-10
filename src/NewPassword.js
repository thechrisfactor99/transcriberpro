import React, { useState, useContext } from "react";
import { Auth } from 'aws-amplify';
import { Link } from "react-router-dom";

import {UserContext} from './UserContext'

import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { green } from '@material-ui/core/colors';

export default function ResetLogin(props) {
  const auth = useContext(UserContext)
  //const [email, setEmail] = useState("")
  const [oldPassword, setOldPassword] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  //const [codeSent, setCodeSent] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
 //const [isSendingCode, setIsSendingCode] = useState(false);
  const [savedPassword, setSavedPassword] = useState(false)

  /*const handleEmailChange = (event) => {
    setEmail(event.target.value)
  }*/

  const handleOldPasswordChange = (event) => {
    setOldPassword(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value)
  }

  function validateResetForm() {
    return (
      oldPassword.length > 0 &&
      password.length > 0 &&
      password === confirmPassword
    );
  }


  async function handleConfirmClick(event) {
    event.preventDefault();

    setIsConfirming(true);

    Auth.currentAuthenticatedUser()
      .then(user => {
          return Auth.changePassword(user, oldPassword, password);
      })
      .then(data => {
        setConfirmed(true)
        setSavedPassword(true)
      })
      .catch(err => {
        setConfirmed(false)
      });

    }


  const savedPasswordDisplay = savedPassword ? <div className="w-5/6 mx-auto mt-4 text-green-700 flex content-center"><div className="px-2">Settings Saved </div> <CheckCircleOutlineIcon style={{ color: green[600]}} /></div> : null

  return(
    <div className="w-full h-full"> 
        <div className="w-full p-4 bg-white">
          <Link className="text-blue-500" to="/settings">{"<<"} Settings</Link>
        </div>
      {savedPasswordDisplay}
      <form onSubmit={handleConfirmClick} className="my-8 p-8 bg-white w-5/6 mx-auto ">
        <h1 className="text-2xl">Change Password</h1>
        <div className="flex">
        <div className="w-1/2 flex flex-col">
          <div className="flex my-4 w-full">
            <p className="my-auto pr-4 w-1/3 text-right">Old Password:</p>
            <input className="border w-1/2" onChange={handleOldPasswordChange} type="password" value={oldPassword} id="oldPassword"></input>
          </div>
          <div className="flex my-4 w-full">
            <p className="my-auto pr-4 w-1/3 text-right">New Password:</p>
            <input className="border w-1/2" onChange={handlePasswordChange} type="password" value={password} id="password"></input>
          </div>
          <div className="flex my-4 w-full">
            <p className="my-auto pr-4 w-1/3 text-right">Confirm Password:</p>
            <input className="border w-1/2" onChange={handleConfirmPasswordChange} type="password" value={confirmPassword} id="confirmPassword"></input>
          </div>
        </div>
      </div>
        <button disabled={!validateResetForm()} className="px-6 py-2 bg-blue-500 text-white rounded-sm">Confirm</button>
      </form>
    </div>
    )
}