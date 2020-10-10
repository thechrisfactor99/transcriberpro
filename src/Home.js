import React, { useState, useEffect, useContext }  from "react";
import logo from './logo.svg';
import './App.css';
import './Curran.css';


import Table from './components/Table'
import TranscriptUpload from './components/TranscriptUpload'

import Routes from './Routes'

import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

import Login from './Login'
import {UserContext} from './UserContext'

import {useListQL} from './hooks/useListQL'
import {transcriptionSchema} from './schemas/schemas'

import Input from './components/Input'


import Amplify, { API, graphqlOperation, Auth, Analytics, Storage } from 'aws-amplify';
import awsExports from "./aws-exports";
Amplify.configure(awsExports);

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


function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function makeComparator(key, order='desc') {
  return (a, b) => {
    if(!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) return 0; 

    const aVal = (typeof a[key] === 'string') ? a[key].toUpperCase() : a[key];
    const bVal = (typeof b[key] === 'string') ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (aVal > bVal) comparison = 1;
    if (aVal < bVal) comparison = -1;

    return order === 'desc' ? (comparison * -1) : comparison
  };
}

function offsetTimezone(date){
    var offset = new Date(date).getTimezoneOffset();
    var offsetTime = new Date(new Date(date).getTime() - offset * 60 * 1000).toISOString()

    return(offsetTime)
}

function Home(props) {

  const [transcriptions, setTranscriptions] = useState([])
  const auth = useContext(UserContext)

  const [uploadRequest, setUploadRequest] = useState(false)
  const[uploaded, setUploaded] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [sortField, setSortField] = useState("ts")
  const [sortOrder, setSortOrder] = useState("desc")

  const [transcriptionName, setTranscriptionName] = useState("")

  //const {schemaName, saved, stateDict, handleDelete} = useListQL(transcriptionSchema, )

  
  async function fetchTranscriptions(){
    const transcriptionData = await API.graphql(graphqlOperation(`query ListTranscriptions {
      listTranscriptions(filter: {user: {eq:"${props.user.username}"}}, limit: 9999) {
        items {
            id
            displayName
            fileName
            createdAt
            user
            transcriptionStatus
        }
      }
      }`))

    if(transcriptionData.data.listTranscriptions.items.length > 0){
      const newTranscriptions = transcriptionData.data.listTranscriptions.items.map(t => {
        return({...t, createdAt: offsetTimezone(t.createdAt), ts: new Date(t.createdAt).getTime()})
      })  
      setTranscriptions(newTranscriptions)
    }
  }

  const handleDeleteTranscript = async (id) => {
    const deletedTranscript = await API.graphql(graphqlOperation(`mutation delete {
          deleteTranscription (input: {id: "${id}"}){id}}`))


      /*   const updatedTranscripts = transcriptions.filter(t => t.id != id)
    console.log(updatedTranscripts)
    setTranscriptions(updatedTranscripts)
    */
    let updatedTranscripts = transcriptions.map(t => {
      if(t.id == id){
        return{...t, deleted: true}
      }
      else{
        return(t)
      }

    })

    updatedTranscripts = updatedTranscripts.filter(t => t.deleted != true)
    setTranscriptions(updatedTranscripts)

  }
    const confirmDelete = (transcriptionId) => {
      confirmAlert({
        title: 'Confirm to submit',
        message: 'Are you sure you want to delete?',
        buttons: [
          {
            label: 'Yes',
            onClick: () => handleDeleteTranscript(transcriptionId)
          },
          {
            label: 'No',
            onClick: () => null
          }
        ]
      });
    }

  const handleUploadForm = async (e) => {
      const file = e.target.files[0];
      const ext = file.name.split('.')[1]

      setUploadRequest(true)
  }

  useEffect(() => {
    fetchTranscriptions()

  }, [])

    return (
      <div className="w-full ">
          <div className="ml-6 w-5/6">
            <h1 className="my-2 text-lg w-1/2 font-bold">Upload Transcription:</h1>
            <TranscriptUpload auth={auth} time_balance={props.stateDict.time_balance} /> 
            <div className="mt-6">
              {uploading ? <div>Uploading....</div> : null}
              {uploaded ? <div>Audio Uploaded! Your transcription is in progress - check back momentarily for the completed file.</div>: null}
            </div>
          </div>
          
          <h1 className="ml-6 text-lg text-left font-bold mt-12">Your recent transcriptions:</h1>
          {transcriptions.length > 0 ?
            <Table sortField='createdAt' sortOrder='desc' edit={true} pathPrefix={'transcription'} columns={[{column:'Transcription', value: 'fileName'}, {column:'Status', 'value':'transcriptionStatus'}, {column:'Date', value:'createdAt'}]}
              fields={['displayName', 'transcriptionStatus', 'createdAt']}
              values={transcriptions} delete={true} handleDelete={confirmDelete}/> 
              : null}
      </div>
    );

}

export default Home;
