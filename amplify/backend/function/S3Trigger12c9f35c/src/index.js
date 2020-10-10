// eslint-disable-next-line

var AWS = require('aws-sdk');
var transcribeservice = new AWS.TranscribeService();

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

let dynamo = new AWS.DynamoDB.DocumentClient();


async function postTranscription(params){
    try {
     let putTranscriptionResult = await dynamo.update(params, function(err, data) {
      if (err) {
          console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
          console.log("error")
      } else {
          console.log("Added item:", JSON.stringify(data, null, 2));
      }
  }).promise()
    } catch (error) {
        console.error(error);
    }
}

exports.handler = function(event, context, callback) {
  console.log('Received S3 event:', JSON.stringify(event, null, 2));
  // Get the object from the event and show its content type
  const bucket = event.Records[0].s3.bucket.name; //eslint-disable-line
  const key = event.Records[0].s3.object.key; //eslint-disable-line
  console.log(key)
  const mp3Url = `https://transcriptions-chris-curran151600-dev.s3-us-west-2.amazonaws.com/${key}`
  
  console.log(`job-${new Date().toISOString()}`)
  
  let newTranscriptionParams, updatedTranscriptionParams
  
  var params = {
      LanguageCode: 'en-US',
      Media: { /* required */
        MediaFileUri:  mp3Url
      },
      MediaFormat: 'mp3',
      TranscriptionJobName: key.replace('public/', ''),
      OutputBucketName: bucket,
    };
    
    let userId
    
    if(key != ".write_access_check_file.temp"){
      if(key.includes("public")){
        console.log('transcribing service starting...')
        transcribeservice.startTranscriptionJob(params, function(err, data) {
          console.log('running')
          if (err) console.log(err, err.stack); // an error occurred
          else     {
          console.log(data);           // successful response
          event.wait_time = 60;
          //event.JOB_NAME = data.TranscriptionJob.TranscriptionJobName;
          callback(null, event);
          }
        })
      }
      else{
        userId = key.split('---')
        userId = userId[userId.length - 1].replace('.mp3.json', '')
        updatedTranscriptionParams = {
            TableName: "Transcription-6jfgqcxrnrh3pa62msffrcplke-dev",
            Key:{
                'id' : userId,
            },
            UpdateExpression: "set fileName = :f, updatedAt = :u, createdAt = :c, transcriptionStatus = :s",
            ExpressionAttributeValues:{
                ":f": key.replace('/public', ''),
                ":u": new Date().toISOString(),
                ":c": new Date().toISOString(),
                ":s": "COMPLETED"

            },
            ReturnValues:"UPDATED_NEW"
        };
                
        /*newTranscriptionParams = {
          TableName:"Transcription-6jfgqcxrnrh3pa62msffrcplke-dev",
          Item:{
              "HASHKEY": "id",
              "id": uuidv4(),
              "fileName": key.replace('/public', ''),
              "createdAt": new Date().toISOString(),
              "updatedAt": new Date().toISOString(),
              "__typename": "Transcription"
              }
          }
          console.log(newTranscriptionParams)*/
          console.log('posting transcription...')
        postTranscription(updatedTranscriptionParams)
      }
    }

};
