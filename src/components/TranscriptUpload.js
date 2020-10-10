import React, { useState, useEffect, useContext, useRef, useCallback }  from "react";
import Amplify, { API, graphqlOperation, Auth, Analytics, Storage } from 'aws-amplify';
import Input from './Input'
import ReactAudioPlayer from 'react-audio-player';


function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}


function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function getDuration(src) {
    const audio = document.createElement('AUDIO');
    audio.src = src
    audio.addEventListener('loadedmetadata', () => {
    });
}

const TranscriptForm = (props) => {

  const [uploadRequest, setUploadRequest] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [transcriptionName, setTranscriptionName] = useState("")
  const [transcriptionFile, setTrancriptionFile] = useState({})
  const [fileName, setFileName] = useState("")

  const [tempPath, setTempPath] = useState("")

  const [duration, setDuration] = useState(0)

  //const ref = useRef(null)
  const ref1 = useRef(null)
  const [autoPlay, setAutoPlay] = useState(false)
  const [ref, setRef] = useState(null);

  const onRefChange = useCallback(node => {
    setRef(node); // e.g. change ref state to trigger re-render
    if (node === null) { 
      // node is null, if DOM node of ref had been unmounted before
    } else {
    	//setDuration(node.audioEl)
    	//setDuration(node.current.audioEl.current.duration)
      // ref value exists
    }
  }, [ref]);

  const handleTranscriptionUpload = async () => {
      const file = transcriptionFile;

      let ext = file.name.split('.')
      ext = ext[ext.length-1]
      const newId = uuidv4()
      const imagePath = `transcription---${getRandomInt(1000)}---${newId}.${ext}`
      setFileName(imagePath)

      setUploading(true)
      await Storage.put(imagePath, file, {
          acl: 'public-read',
          contentType: 'audio/mp3',
          cors: true
      })
      .then (result => {
      	getDuration()
      	console.log('uploaded')})
      .catch(err => console.log(err));

      const createTranscription = await API.graphql(graphqlOperation(
            `mutation create {
              createTranscription(input: {id: "${newId}", displayName: "${transcriptionName}" fileName: "${imagePath}", s3Input: "${imagePath}", transcriptionStatus: "IN_PROGRESS",
               user: "${props.auth.user}", duration: ${duration}}){
                id
                displayName
                s3Input
                transcriptionStatus
                duration
                user
              }
            }`))

      const updateAccount = await API.graphql(graphqlOperation(
            `mutation update {
              updateAccount(input: {id: "${props.auth.user}", time_balance: "${Number(props.time_balance) - duration}"}){
                id
                time_balance
              }
            }`))

      let imageUrl = `https://transcriptions-chris-curran151600-dev.s3-us-west-2.amazonaws.com/public${imagePath.split(' ').join('+')}`

      setUploading(false)
      setUploaded(true)
  }

  const handleUploadForm = async (e) => {
	  const file = e.target.files[0];
      var tmppath = URL.createObjectURL(file);
      setTempPath(tmppath)

	  setFileName(file.name)
	  setTrancriptionFile(file)

	  setUploadRequest(true)

  }

  useEffect(() => {

	    if(duration == 0 || duration == NaN){
			setInterval(function(){ 
				if(ref != null){
					if(ref.audioEl != null){
						if(ref.audioEl.current != null){
							if(duration == 0 || duration == NaN){
					    		setDuration(ref.audioEl.current.duration/60)
							}
						}
					}
				}
			}, 1000)}


  }, [ref])

	return(
		<div> 

	        {uploaded ? 
	        	null
	          : uploadRequest ? 
	        	<div className="flex flex-col">
		          	<ReactAudioPlayer
						  ref={onRefChange}
						  autoPlay={autoPlay}
						  controls
						  src={tempPath}
						/>
					{duration > 0 ? 
						<div>
							<Input onChange={(e) => setTranscriptionName(e.target.value)} label={"Transcription Name"} value={transcriptionName} name={"transcriptionName"}  />
							<Input disabled={true} label={"Minutes"} value={duration != 0 ? duration.toFixed(2) : 0} name={"duration"}  />
	            			<p>Time Remaining: {Number(props.time_balance) - duration}</p>
	            		</div>  : null}
	            	<button onClick={handleTranscriptionUpload} className="gradient-btn">Submit</button>
	          	</div>
				:
	          	<input name="logo"
	              type="file" accept='audio/mp3, audio/mp4, video/mp4'
	              onChange={(e) => handleUploadForm(e)}
	          	/>
	        }
          {uploading ? <div>Uploading....</div> : null}
          {uploaded ? <div>Audio Uploaded! Your transcription is in progress - check back momentarily for the completed file.</div>: null}

        </div>
		)
}

export default TranscriptForm