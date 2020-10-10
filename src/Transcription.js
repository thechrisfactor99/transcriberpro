import React, { useState, useEffect, useContext, useRef }  from "react";
import Amplify, { API, graphqlOperation, Auth, Analytics, Storage } from 'aws-amplify';

import {useFormQL} from './hooks/useFormQL'
import { Link, useParams } from "react-router-dom";

import Table from './components/Table'
import Input from './components/Input'

import SearchBar from './components/SearchBar'

import CreateIcon from '@material-ui/icons/Create';
import SaveIcon from '@material-ui/icons/Save';


import ReactAudioPlayer from 'react-audio-player';

import ReactPlayer from 'react-player'

import {transcriptionSchema} from './schemas/schemas'

import {CSVLink, CSVDownload} from 'react-csv';

Amplify.configure({
    Storage: {
        AWSS3: {
            bucket: 'transcriptions-chris-curran151600-dev', //REQUIRED -  Amazon S3 bucket
        }
    }
});

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

const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}


const Transcription = (props) => {

	const params = useParams()
	const {schemaName, saved, stateDict, handleSubmit, handleInputChange} = useFormQL(transcriptionSchema, params.transcriptionId) //get form state
	const [transcript, setTranscript] = useState([])
	const [words, setWords] = useState([])
	const [mp3, setMp3] = useState({})

	const ref = useRef(null)
	const editRef = useRef(null)
	const [currentTime, setCurrentTime] = useState(0)
	const [currentWord, setCurrentWord] = useState(0)

	const [editing, setEditing] = useState(false)
	const [cursorPos, setCursorPosition] = useState(0)
	const [cursorLength, setCursorLength] = useState(1)
	const [cursorWord, setCursorWord] = useState(0)

	const [activeSearch, setActiveSearch] =useState(false)
	const [searchWord, setSearchWord] = useState("")

	const [wordTimes, setWordTimes] = useState([])

	const [autoPlay, setAutoPlay] = useState(false)

	const [currentSearchStart, setCurrentSearchStart] = useState(0)
	const [currentSearchEnd, setCurrentSearchEnd] = useState(0)

	const [unsavedChanges, setUnsavedChanges] = useState(false)
	const [savedEdit, setSavedEdit] = useState(false)

	const findCurrentWord = (currentWord) => {
		let oldCurrentWord = currentWord
		let newCurrentWord = oldCurrentWord
		for(let i = oldCurrentWord > 0 ? oldCurrentWord - 1 : 0; i<words.length; i++){
			if(currentTime < Number(words[i]['end_time'])){
				newCurrentWord = i
				break
			}
		}
		setCurrentWord(newCurrentWord)
	}

    
    const fetchMp3 = async () => {
    	const customPrefix = { public: '' };
    	const reader = new FileReader();


		let data = await Storage.get(stateDict.fileName, { download: true, customPrefix: customPrefix })
		.then(data => data).catch(err => console.log(err)) // defaults to `public`)
		setMp3(data)

		if(data != undefined){
			let dataJ = await data.Body.text().then(string => JSON.parse(string))
			let dataJTranscripts = dataJ.results.transcripts
			let dataJWords = dataJ.results.items

			console.log(dataJTranscripts)
			console.log(dataJWords)

			let wordPosition = 0
			let newWords = []
			let newWord

	    	for(let i=0; i<dataJWords.length; i++){
	    		newWord = {...dataJWords[i], position: wordPosition}
	    		newWords.push(newWord)
	    		if(dataJWords[i].type != "pronunciation"){
	    			wordPosition += (dataJWords[i].alternatives[0].content.length)
	    		}
	    		else{
	    			wordPosition += (dataJWords[i].alternatives[0].content.length + 1)
	    		}
	    	}
	    	newWords = newWords.filter(w => w.type == "pronunciation").map((w, i) => {return({...w, id: i})})

			let newTranscripts = []
			let count = 1
			let newTranscript
			let newTranscriptText
			for(let i=0; i<dataJTranscripts.length; i++){
				newTranscript = {...dataJTranscripts[i], rowId: count}
				newTranscripts.push({...dataJTranscripts[i], rowId: count})
				count++
			}
			setTranscript(newTranscripts)
			setWords(newWords)
		}


    }

    const handleEditFocus = (w) => {
    	/*setEditing(true)
		setCursorWord(w.id)
		setCursorLength(w.word.length)
		setCursorPosition(w.position)*/
		setEditing(true)
		setCursorWord(currentWord)
		setCursorLength(words[currentWord].alternatives[0].content.length)
		setCursorPosition(words[currentWord].position)
    }

    const handleChangeAudioTime = (e) => {
       	ref.current.audioEl.current.currentTime = words[e.id].start_time
       	setCurrentWord(e.id)
    }

    const handleChangeSearch = (e) => {
   		ref.current.audioEl.current.currentTime = e.start_time
		const newSearchWord = e.value
		setSearchWord(newSearchWord)
		setCurrentWord(e.key)
		setCurrentTime(e.currentTime)
		setCurrentSearchStart(e.key-2)
		setCurrentSearchEnd(e.key+2)
		setActiveSearch(true)

    }

    const handleEditTranscript = (e) => {
    	let newTranscript = transcript.map(t => {
    		return {...t, transcript: e.target.value}
    	})

    	if(newTranscript != transcript){
    		setUnsavedChanges(true)
    		setSavedEdit(false)
    		setTranscript(newTranscript)
    	}
    }

    const handleUpdateTranscript = (e) => {
    	console.log('unsaved')

    }

    const handleSaveEdits = () =>{
    	setUnsavedChanges(false)
    	setSavedEdit(true)
    }

    const listSearchClips = wordTimes.map(w =>{
    	return(
    		<div className="flex">
    			<p>Time: {w.start_time}</p>
    			<button onClick={() => {ref.current.audioEl.current.currentTime = w.start_time - 3 > 0 ? w.start_time - 3 : 0}}>Jump to Clip</button>
    		</div>
    		)
    	}
    )


    const listTranscriptLines = transcript.map(line => {
    	
    	const lineWords = line.transcript.split(' ')
    	let tWords = []
    	let word = {}
    	let wordItem = []
    	let style
    	let wordPosition = 0
    	for(let i=0; i<lineWords.length; i++){
    		if(words.length > 0){
    			wordItem = words[i].alternatives
    		}
    		word = {id: i, word: lineWords[i], alternatives: wordItem, position: wordPosition}
    		tWords.push(word)
    		wordPosition += (lineWords[i].length + 1)
    	}
    	const listLineWords = tWords.map(word =>{
    		if(activeSearch){
    			style = (word.id >= currentSearchStart && word.id <= currentSearchEnd) ? "bg-gray-200 text-lg" : "text-lg"
    		}
    		else if(word.alternatives != "undefined" && word.alternatives.length > 0){
    			style = word.id == currentWord ? "bg-gray-200 text-lg" : word.alternatives[0].confidence < .7 ? "text-red-500 text-lg" : "text-lg"
    		}
    		else{
     			style = word.id == currentWord ? "bg-gray-200 text-lg" : "text-lg"
    		}
    		return(
    			<span onClick={() => handleChangeAudioTime(word)} className={style}>{word.id == 0 ? capitalize(word.word) : word.word} </span>
					
    			)
    	})

    	if(editing){
    		return(
	    		<tr>
	    			<td className={`w-1/6 p-4 text-right text-lg`}>Speaker:</td>
	    			<td onBlur={handleUpdateTranscript} onClick={() => console.log(editRef.current.selectionStart)} className={`w-2/3 p-4 text-left`}><textarea onChange={handleEditTranscript} onClick={() => {setActiveSearch(false)}} ref={editRef} onBlur={()=>setEditing(false)} className="w-full h-56 text-lg" value={capitalize(line.transcript)}></textarea></td>
	    			<td className={`w-1/6 p-4 text-left text-lg`}>0.00</td>
	    		</tr>
    		)
    	}
    	else{
	    	return(
	    		<tr>
	    			<td className={`w-1/6 p-4 text-right text-lg`}>Speaker:</td>
	    			<td onClick={() => {setActiveSearch(false)}}  className={`w-2/3 p-4 text-left`}>{listLineWords}</td>
	    			<td className={`w-1/6 p-4 text-left text-lg`}><CreateIcon onClick={handleEditFocus} className="table-icon" /></td>
	    		</tr>
	    		)
    	}
    	}
    )

    const createSearchPhrases = () => {
    	console.log('creating phrases...')
    }


    const searchWords = words.map((w, i) =>{

    	const getPhrase = (w_list) => {
    		let newList =  w_list.slice(w.id-2,w.id+3).map(w => w.alternatives[0].content).join(' ')
    		return(newList)
    	}

    	let display
    	if(words.length > 0){
    		display = getPhrase(words)
    	}
    	return({key: w.id, start_time: w.start_time, value: w.alternatives[0].content, label: display, firstLetter: w.alternatives[0].content[0]})
	}).sort(makeComparator('firstLetter'))


	  useEffect(
    () => {
    	fetchMp3()
    	console.log(ref.current)
  }, [stateDict])

	  useEffect(
    () => {
    	if(editRef.current != null){
    		editRef.current.focus()
    		editRef.current.selectionStart = cursorPos;
    		editRef.current.selectionEnd = cursorPos + cursorLength;

    	}
  }, [editing])

	  useEffect(
    () => {
    	setInterval(function(){ 
    		if(ref.current != null){
	    		setCurrentTime(ref.current.audioEl.current.currentTime)
    		}
    	}, 200)

  }, [ref.current]) 
 

	  useEffect(
    () => {
    	findCurrentWord(currentWord)
  }, [currentTime])      
					//<ReactPlayer controls={true} url={`https://transcriptions-chris-curran151600-dev.s3-us-west-2.amazonaws.com/public/${stateDict.fileName.replace('.json', '')}`} />

	return(
		<div className="w-full">
			<div className="w-5/6 mx-auto">
				<Link to="/" className="text-blue-500 hover:text-blue-700 hover:underline">{"<< Back"}</Link>
				<h1 className="text-lg font-bold my-4">{stateDict.displayName}</h1>
				<div className="flex justify-between w-full">
					<div className="flex w-2/3">
					<ReactAudioPlayer
					  ref={ref}
					  autoPlay={autoPlay}
					  controls
					  src={`https://transcriptions-chris-curran151600-dev.s3-us-west-2.amazonaws.com/public/${stateDict.fileName.replace('.json', '')}`}
					/>

			        <div className="w-1/3 my-auto"><SearchBar options={searchWords} onChange={handleChangeSearch} placeholder="Search Keywords" /></div>
					<button onClick={handleSaveEdits} disabled={!unsavedChanges}><SaveIcon className={unsavedChanges ? "ml-6 unsaved-icon my-auto" : "ml-6 saved-icon my-auto"} /></button>
					{savedEdit ? <div className="my-auto ml-2 text-gray-500">Saved</div> : null}
					</div>
					<CSVLink className="gradient-btn mt-4 mx-2 my-auto" filename={`${stateDict.fileName}.csv`} data={transcript}>Download</CSVLink>
				</div>
				<div className={activeSearch ? "" : "hidden"}>
					{listSearchClips}
				</div>
			</div>
			<div className="text-left w-full">
				<table className="w-full bg-white rounded-sm table-border">	
					<thead>
						<tr>
							<th className={`w-1/8 px-4 pb-4 table-h`}></th>
							<th className={`w-3/4 px-4 pb-4 table-h`}></th>
							<th className={`w-1/8 px-4 pb-4 table-h`}></th>
						</tr>
					</thead>
					<tbody>
						{listTranscriptLines}
					</tbody>
				</table>
			</div>
		</div>

		)
}

export default Transcription;