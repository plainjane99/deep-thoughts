// import the gql tagged template literal functionality to create a GraphQL mutation called login
import gql from 'graphql-tag';

// This will accept two variables, $email and $password, 
// whose values we'll set up to be passed in as arguments when we integrate this with the login form page
// return the logged-in user's data and the token. 
// With this token, we'll be able to perform other actions unique to the logged-in user.
export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

// creating a new user through the signup form page by passing to the useMutation Hook in signup
export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

// mutation returns an updated user object whose ID matches the me object already stored in cache
// When the cache is updated, the useQuery(QUERY_ME_BASIC) Hook on the homepage causes a re-render.
export const ADD_FRIEND = gql`
  mutation addFriend($id: ID!) {
    addFriend(friendId: $id) {
      _id
      username
      friendCount
      friends {
        _id
        username
      }
    }
  }
`;

// mutation for adding the thought to the database
export const ADD_THOUGHT = gql`
  mutation addThought($thoughtText: String!) {
    addThought(thoughtText: $thoughtText) {
      _id
      thoughtText
      createdAt
      username
      reactionCount
      reactions {
        _id
      }
    }
  }
`;

export const ADD_REACTION = gql`
  mutation addReaction($thoughtId: ID!, $reactionBody: String!) {
    addReaction(thoughtId: $thoughtId, reactionBody: $reactionBody) {
      _id
      reactionCount
      reactions {
        _id
        reactionBody
        createdAt
        username
      }
    }
  }
`;