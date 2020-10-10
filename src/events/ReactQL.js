import React, { useState, useEffect, useContext, useForceUpdate}  from "react";
import {useParams, Link, Redirect} from "react-router-dom"
import usePath from 'react-use-path';

import Amplify, { API, graphqlOperation, Auth, Analytics } from 'aws-amplify';

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getStateDict = (schema, fieldList=null, id=null) =>{
  const startPos = schema.indexOf("{")
  const endPos = schema.indexOf("}")

  let formString = schema.split(" ").join("").substring(startPos, endPos-startPos)

  const formArray = formString.split("\n")
  let formArray2 = []
  let formDict = {}
  for(let i=1; i<formArray.length-1; i++){
    if(fieldList != null){
      let formItem = formArray[i].replace(" ", "").split(':')
      if(fieldList.includes(formItem[0])){
        formArray2.push(formItem)
        formDict[formItem[0]] = formItem[1]
      }
    }
    else{
      let formItem = formArray[i].replace(" ", "").split(':')
      formArray2.push(formItem)
      formDict[formItem[0]] = formItem[1]
    }
  }

  let stateDict = {}
  for(let key in formDict){
    if(formDict[key] == "Boolean"){
      stateDict[key] = false
    }
    else{
      stateDict[key] = ""
    }
  }

  return stateDict
}

const getStateList = (schema, fieldList=null, id=null) =>{
  const startPos = schema.indexOf("{") -1
  const endPos = schema.indexOf("}")

  let formString = schema.split(" ").join("").substring(startPos, endPos-startPos)

  const formArray = formString.split("\n")
  let formArray2 = []
  let formDict = {}
  for(let i=0; i<formArray.length-1; i++){
    if(fieldList != null){
      let formItem = formArray[i].replace(" ", "").split(':')
      if(fieldList.includes(formItem[0])){
        formArray2.push(formItem)
        formDict[formItem[0]] = formItem[1]
      }
    }
    else{
      let formItem = formArray[i].replace(" ", "").split(':')
      formArray2.push(formItem)
      formDict[formItem[0]] = formItem[1]
    }
  }

  let stateDict = {}
  for(let key in formDict){
    if(formDict[key] == "Boolean"){
      stateDict[key] = false
    }
    else{
      stateDict[key] = ""
    }
  }

  return stateDict
}

const createFormArray = (stateDict) => {
  let formArray = []
  for(let key in stateDict){
    formArray.push([key, stateDict[key]])
  }
  return formArray
}

const createListArray = (stateList) => {
  let formArray = []
  for(let key in stateList){
    formArray.push([key, stateList[key]])
  }
  return formArray
}

const getSchema = (schema, id) =>{

  const schemaName = schema.split(" ")[1].split(/(?=[A-Z])/).join(" ")

  let stateDict = getStateDict(schema)

  let fields = createFormArray(stateDict)

  let fieldsString = ""
  for(let i =0; i<fields.length; i++){
    fieldsString = fieldsString + fields[i][0] + " \n"
  }
  let get = `query Get${schemaName} {
    get${schemaName}(id: "${id}"){
      ${fieldsString}
    }
  }`

  return get
}

const listSchema = (schema, filterDict) =>{

  const schemaName = schema.split(" ")[1].split(/(?=[A-Z])/).join("")

  let stateList = getStateList(schema)

  let fields = createListArray(stateList)

  let fieldsString = ""
  for(let i =0; i<fields.length; i++){
    fieldsString = fieldsString + fields[i][0] + " \n"
  }
  let list
  if(typeof filterDict.value == "string"){
    list = `query List${schemaName}s {
      list${schemaName}s(filter: {${filterDict.name}: {eq:"${filterDict.value}"}}, limit: 9999){
        items{
          ${fieldsString}
        }
      }
    }`  
  }
  else{
    list = `query List${schemaName}s {
      list${schemaName}s(filter: {${filterDict.name}: {eq:${filterDict.value}}}, limit: 9999){
        items{
          ${fieldsString}
        }
      }
    }`
  }

  return list
}

const fetchList = async (schema, filterDict) => {
  const schemaName = schema.split(" ")[1].split(/(?=[A-Z])/).join("")
  console.log(schemaName)

  const schemaList = listSchema(schema, filterDict)

  let obj = await API.graphql(graphqlOperation(schemaList))
  obj = obj['data'][`list${schemaName}s`]['items']

  return obj
  }

////

const createSchema = (stateDict, schema) => {
  //let stateDict = getStateDict(schema)

  const schemaName = schema.split(" ")[1].split(/(?=[A-Z])/).join(" ")

  let fields = createFormArray(stateDict)

  let fieldsString = ""
  for(let i =0; i<fields.length; i++){
    fieldsString = fieldsString + fields[i][0] + " \n"
  }

  let dictString = ""
  for(let key in stateDict){
    if(typeof stateDict[key] == "string"){
      dictString = dictString + `${key}: "${stateDict[key]}", `
    }
    else{
      dictString = dictString + `${key}: ${stateDict[key]}, `        
    }
  }

  let create = `mutation create {
  create${schemaName}(input: {${dictString}}){
    ${fieldsString}
    }
  }`

  return create
}

const updateSchema = (stateDict, schema, id) => {

  //let stateDict = getStateDict(schema)

  const schemaName = schema.split(" ")[1].split(/(?=[A-Z])/).join(" ")

  let fields = createFormArray()

  let fieldsString = ""
  for(let i =0; i<fields.length; i++){
    fieldsString = fieldsString + fields[i][0] + " \n"
  }

  let dictString = ""
  for(let key in stateDict){
    if(typeof stateDict[key] == "string"){
      dictString = dictString + `${key}: "${stateDict[key]}", `
    }
    else{
      dictString = dictString + `${key}: ${stateDict[key]}, `        
    }
  }

  let update = `mutation update {
    update${schemaName}(input: {id: "${id}", ${dictString}}){
      id
      ${fieldsString}
    }
  }`

  return update
}

const deleteSchema = (schema, id) => {

  const schemaName = schema.split(" ")[1].split(/(?=[A-Z])/).join(" ")

  let sdelete = `mutation delete {delete${schemaName} (input: {id: "${id}}){id}}`
  return sdelete
}


const fetchForm = async (schema, id) => {
	const schemaName = schema.split(" ")[1].split(/(?=[A-Z])/).join(" ")

	const schemaGet = getSchema(schema, id)

	let obj = await API.graphql(graphqlOperation(schemaGet))
	obj = obj['data'][`get${schemaName}`]

	let newStateDict = {}
	for(let key in obj){
	  newStateDict[key] = obj[key]
	}


	return newStateDict
	}

const getFormInputState = (inputList, stateDict) => {
  return inputList.map(input => {

    if(typeof input[1] == "string"){
      return ({title: capitalizeFirstLetter(input[0].split(/(?=[A-Z])/).join(" ")), type: "text", value: stateDict[input[0]], name: `${input[0]}`, id: `${input[0]}`})
      } 

    else if(typeof input[1] == "boolean"){
      return ({title: capitalizeFirstLetter(input[0].split(/(?=[A-Z])/).join(" ")), type: "checkBox", checked: stateDict[input[0]], name: `${input[0]}`, id: `${input[0]}`})
      }
    }
  )
}



export { capitalizeFirstLetter, getStateDict, getStateList, getFormInputState, createFormArray, getSchema, listSchema, createSchema, deleteSchema, updateSchema, fetchForm, fetchList }