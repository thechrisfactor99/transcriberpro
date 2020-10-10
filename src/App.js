import React, { useState, useEffect, useContext }  from "react";
import logo from './logo.svg';
import './App.css';
import './Curran.css';


import Table from './components/Table'
import HorNav from './components/HorNav'


import Routes from './Routes'
import LoginRoutes from './LoginRoutes'


import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

import Login from './Login'
import {UserContext} from './UserContext'


import Amplify, { API, graphqlOperation, Auth, Analytics, Storage } from 'aws-amplify';
import awsconfig from './aws-exports';

import {useFormQL} from './hooks/useFormQL'
import {accountSchema} from './schemas/schemas'


Amplify.configure(awsconfig);


Amplify.configure({
    Storage: {
        AWSS3: {
            bucket: 'transcriptions-chris-curran151600-dev', //REQUIRED -  Amazon S3 bucket
        }
    }
});

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function App(props) {

  const [savedTranscript, setSavedTranscript] = useState(false)
  const [transcriptions, setTranscriptions] = useState([])
  const [loggedIn, setLoggedIn] = useState(false)
  const auth = useContext(UserContext)

  const {schemaName, saved, stateDict, handleSubmit, handleInputChange} = useFormQL(accountSchema, auth.user) //get form state

  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [user, setUser] = useState("")
  const [email, setEmail] = useState(stateDict.email)
  const [timeBalance, setTimeBalance] = useState(stateDict.time_balance)
  
  async function fetchTranscriptions(){
    const transcriptionData = await API.graphql(graphqlOperation(`query ListTranscriptions {
      listTranscriptions(limit: 9999) {
        items {
            id
            fileName
            createdAt
        }
      }
      }`))

    if(transcriptionData.data.listTranscriptions.items.length > 0){
      setTranscriptions(transcriptionData.data.listTranscriptions.items)
    }
  }

    const confirmDelete = (practiceId) => {
      confirmAlert({
        title: 'Confirm to submit',
        message: 'Are you sure you want to delete?',
        buttons: [
          {
            label: 'Yes',
            onClick: () => null
          },
          {
            label: 'No',
            onClick: () => null
          }
        ]
      });
    }


  const handleTranscriptionUpload = async (e) => {
      const file = e.target.files[0];
      const imagePath = `transcription-${getRandomInt(1000)}.mp3`
      await Storage.put(imagePath, file, {
          acl: 'public-read',
          contentType: 'audio/mp3',
          cors: true
      })
      .then (result => console.log(result))
      .catch(err => console.log(err));

      let imageUrl = `https://transcriptions-chris-curran151600-dev.s3-us-west-2.amazonaws.com/public${imagePath.split(' ').join('+')}`

      setSavedTranscript(true)
  }



  useEffect(() => {
    fetchTranscriptions()
  }, [auth, user])

  useEffect(() => {
    let updateUser = async authUser => {
      try{
        let userSess = await Auth.currentAuthenticatedUser()
        setUser(userSess)
      }
      catch{
        setUser(null)
      }
      let userSess = await Auth.currentAuthenticatedUser()
        setUser(userSess)
      }

    /*if(auth != undefined){
      if(auth.user != undefined){
        fetchAccount()
      }
    }*/
    updateUser()
  }, [auth])

  if(user != "" && user != null){
    return (
      <div className="w-full">
        <HorNav email={stateDict.email} time_balance={stateDict.time_balance} showProf={true} userHasAuthenticated={userHasAuthenticated} setUser={setUser}/>
        <Routes appProps={{user, setUser, stateDict}} />
      </div>
    );
  }
  else{
    return(
      <div className="w-full">
        <HorNav email={stateDict.email} time_balance={stateDict.time_balance} showProf={false} userHasAuthenticated={userHasAuthenticated} setUser={setUser}/>
        <LoginRoutes appProps={{isAuthenticated, userHasAuthenticated}} />
      </div>
      )
  }
}

export default App;
