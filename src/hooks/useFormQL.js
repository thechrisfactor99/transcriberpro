import React, {useState, useEffect, useContext}  from "react";

import { capitalizeFirstLetter,createFormArray, getStateDict, getFormInputState, getSchema, createSchema, deleteSchema, updateSchema, fetchForm } from '../events/ReactQL'
import {handleFormSubmit, handleFormInputChange} from '../events/EventQL'

import {UserContext} from '../UserContext'

import Amplify, { Storage } from 'aws-amplify';

Amplify.configure({
    Storage: {
        AWSS3: {
            bucket: 'dentaladminaea9b1cbcd384e2e983b32678006c1a394617-dev', //REQUIRED -  Amazon S3 bucket
        }
    }
});

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function useFormQL(schema, id=null, authField=null, imagePath=null, fieldList=null, cols=true){

  const auth = useContext(UserContext)

  const [stateDict, setStateDict] = useState(getStateDict(schema, fieldList, id))
  const [inputList, setInputList] = useState(createFormArray(getStateDict(schema, fieldList, id)))
  const [saved, setSaved] = useState(false)
  const schemaName = schema.split(" ")[1].split(/(?=[A-Z])/).join(" ")

  const handleInputChange = (e) => {
    const [newInputList, newStateDict] = handleFormInputChange(e, stateDict, inputList) //add event handler function
    setInputList(newInputList) //setState
    setStateDict(newStateDict) //setState
  }

  const handleImageInputChange = async (e, rootImagePath=imagePath) => {
        const eventName = e.target.name
        const file = e.target.files[0];

        const imagePath = `${rootImagePath} ${getRandomInt(1000)}.png`
        await Storage.put(imagePath, file, {
            acl: 'public-read',
            contentType: 'image/png',
            cors: true
        })
        .then (result => console.log(result))
        .catch(err => console.log(err));

        let imageUrl = `https://dentaladminaea9b1cbcd384e2e983b32678006c1a394617-dev.s3-us-west-2.amazonaws.com/public/${imagePath.split(' ').join('+')}`
        let event = {target: {type: 'file', name: eventName}}
        const [newInputList, newStateDict] = handleFormInputChange(event, stateDict, inputList, imageUrl) //add event handler function
        setInputList(newInputList) //setState
        setStateDict(newStateDict) //setState  
    }

  const handleSubmit = async (e) => { 
    await handleFormSubmit(e, stateDict, schema, id) //add event handler function
    setSaved(true) //setState
  }

  useEffect(
    () => {
      if(id != null){
        const fetchState = async () => {
          let fetchedStateDict = await fetchForm(schema, id)
          setStateDict(fetchedStateDict)
        }
        fetchState()
      }
      if(authField != null){
        let newStateDict = stateDict
        newStateDict[authField] = auth.user 
        setStateDict(newStateDict)
      }

  }, [id])      

  return {schemaName, saved, stateDict, handleSubmit, handleInputChange, handleImageInputChange}
}

export { useFormQL }