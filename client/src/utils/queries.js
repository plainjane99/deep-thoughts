// This file will store all of the GraphQL query requests.

// import gql function
import gql from 'graphql-tag';

// query is saved as QUERY_THOUGHTS
// query is wrapped in template literal
export const QUERY_THOUGHTS = gql`
  query thoughts($username: String) {
    thoughts(username: $username) {
      _id
      thoughtText
      createdAt
      username
      reactionCount
      reactions {
        _id
        createdAt
        username
        reactionBody
      }
    }
  }
`;