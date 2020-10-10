import React, { useState, useEffect, useContext, useForceUpdate}  from "react";
import {useParams, Link, Redirect} from "react-router-dom"
import usePath from 'react-use-path';
import Amplify, { API, graphqlOperation, Auth, Analytics } from 'aws-amplify';

import { capitalizeFirstLetter,createFormArray, getStateDict, getSchema, createSchema, deleteSchema, updateSchema, fetchForm } from './ReactQL'


const handleFormInputChange = (e, stateDict, inputList, imagePath=null) => {
  const newStateDict = stateDict
  if(e.target.type == "file"){
    newStateDict[e.target.name] = imagePath
  }
  else if (e.target.type == "checkbox"){
    newStateDict[e.target.name] = [e.target.checked][0]
  }
  else{
    newStateDict[e.target.name] = e.target.value
  }
  const newInputList = inputList.map(input => {
    let newInput = []
    let newInput1
    if(input[0] == e.target.name){
      if(e.target.type == "text"){
        newInput1 = e.target.value
      }
      else if(e.target.type == "file"){
        newInput1 = imagePath
      }
      else{
        newInput1 = [e.target.checked][0]          
      }
      newInput = [input[0], newInput1]
      return newInput
    }
    else{
      return input
    }
  })

  return [newInputList, newStateDict]
}

const handleFormSubmit = async (e, stateDict, schema, id, auth, authField) => {
  e.preventDefault()

  const schemaName = schema.split(" ")[1].split(/(?=[A-Z])/).join(" ")

  if(id == null){
    const createResult = await API.graphql(graphqlOperation(createSchema(stateDict, schema)))
  }
  else{
    const updateResult = await API.graphql(graphqlOperation(updateSchema(stateDict, schema, id)))
  }
}


export { handleFormInputChange, handleFormSubmit }