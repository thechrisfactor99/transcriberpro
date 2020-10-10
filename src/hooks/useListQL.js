import React, {useState, useEffect, useContext}  from "react";

import { capitalizeFirstLetter,createFormArray, getStateList, getFormInputState, listSchema, createSchema, deleteSchema, updateSchema, fetchList } from '../events/ReactQL'

import {UserContext} from '../UserContext'

import Amplify, { Storage, API, graphqlOperation } from 'aws-amplify';

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

function useListQL(schema, filterDict, authField=null, fieldList=null){

  const auth = useContext(UserContext)

  const [stateDict, setStateDict] = useState([])
  const [inputList, setInputList] = useState(createFormArray(getStateList(schema, fieldList)))
  const [saved, setSaved] = useState(false)
  const schemaName = schema.split(" ")[1].split(/(?=[A-Z])/).join(" ")

  const handleChange = (newItem) => {
    const newStateDict = stateDict.map(item => {

      if(item != undefined && newItem != undefined){
        if(newItem.id == item.id){
          return newItem
        }
        else{
          return item
        }
      }
      else{
        return item
      }
    })
    setStateDict(newStateDict)
    setSaved(true)
  }

  const handleDelete = async (id) => {
    const deletedObj = await API.graphql(graphqlOperation(`mutation delete {
        delete${schemaName} (input: {id: "${id}"}){id}}`))

    const updatedStateDict = stateDict.map(obj => {
      if(obj.id == id){
        return{...obj, deleted: true}
      }
      else{
        return{...obj}
      }
    })

    let newStateList = []
    for(let i =0; i<updatedStateDict.length; i++){
      if(updatedStateDict[i]['deleted'] != true){
        newStateList.push(updatedStateDict[i])
      }
    }
    setStateDict(newStateList)
    };

  useEffect(
    () => {

    const fetchState = async () => {
      let fetchedStateDict = await fetchList(schema, filterDict)
      setStateDict(fetchedStateDict)
    }
    fetchState()

  }, [])      

  return {schemaName, saved, stateDict, handleDelete, handleChange}
}

export { useListQL }