import { Link } from "react-router-dom";
import React, {useState, useEffect, useContext, useRef}  from "react";

import Amplify, { API, graphqlOperation, Auth, Analytics, Storage } from 'aws-amplify';


const HorNav = (props) => {
  const [showProfile, setShowProfile] = useState(false)

  const handleToggleProfile = () => {
    const newShowProfile = !showProfile
    setShowProfile(newShowProfile)
  }  


  async function handleLogout() {
    setShowProfile(false)
    Auth.signOut()
    props.userHasAuthenticated(false);
    props.setUser(null)
  }

  return(  

  <div className="w-full overflow-auto">
    <div className="w-full flex justify-between p-4">
      <div className="flex w-1/3 justify-between">
        <div className="w-1/2"><img src="/logo.svg"></img></div>
      </div>
      <div className="flex">
        <div className="my-auto pr-4">{props.time_balance != undefined ? Number(props.time_balance).toFixed(1) : null} minutes</div>
        <button onClick={handleToggleProfile} className={props.showProf ? "focus:outline-none bg-blue-700 text-white w-10 h-10 rounded-full hover:bg-blue-700 text-s" : "hidden"}>{props.email != undefined ? props.email.slice(0, 1).toUpperCase() : ''}</button>
      </div>
        {/*officeHasPractice ? <button onClick={handleProfileDropdown} className="focus:outline-none bg-blue-700 text-white w-10 h-10 rounded-full hover:bg-blue-700 text-s">{officeName[0]}</button> : <Link to="/login">Login</Link>*/}
              <div className={showProfile ? "profile-dropdown" : "hidden"}>
                  <div className="profile-mi"><Link to="/settings" className="profile-mi">Settings</Link></div>
                  <button onClick={handleLogout} className="profile-mi">Logout</button>

              </div>

      </div>
    </div>
)
}

export default HorNav;


