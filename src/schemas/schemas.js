import React, { useState, useContext, useEffect } from "react";

const transcriptionSchema = `type Transcription @model {
  id: ID!
  displayName: String
  fileName: String!
  fileType: String
  s3Input: String
  s3Output: String
  status: String
  user: String
}
`

const accountSchema = `type Account @model {
  id: String
  accountType: String
  email: String
  stripe_id: String
  time_balance: String
  createdAt: String
}`



export {transcriptionSchema, accountSchema}