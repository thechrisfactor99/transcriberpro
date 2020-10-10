/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getTranscription = /* GraphQL */ `
  query GetTranscription($id: ID!) {
    getTranscription(id: $id) {
      id
      fileName
      fileType
      s3Input
      s3Output
      status
      user
      transcriptionStatus
      createdAt
      updatedAt
    }
  }
`;
export const listTranscriptions = /* GraphQL */ `
  query ListTranscriptions(
    $filter: ModelTranscriptionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTranscriptions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        fileName
        fileType
        s3Input
        s3Output
        status
        user
        transcriptionStatus
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getAccount = /* GraphQL */ `
  query GetAccount($id: ID!) {
    getAccount(id: $id) {
      id
      accountType
      email
      stripe_id
      time_balance
      createdAt
      updatedAt
    }
  }
`;
export const listAccounts = /* GraphQL */ `
  query ListAccounts(
    $filter: ModelAccountFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAccounts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        accountType
        email
        stripe_id
        time_balance
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
