// definition type
// literally defining every piece of data that the client can expect to work with through a query (get request) or mutation (put, post, delete request)
// this defines the api endpoint but also the exact data and parameters that are tied to that endpoint

// import the gql tagged template function
// tagged templates are an advanced use of template literals
const { gql } = require('apollo-server-express');

// all of our type definitions will go into the tagged template function
// create our typeDefs, which includes the model, query, and mutations
// ---------------------------------------------------
// we define the datatype (model) that is to be returned:
// ----------so that we always have the data we are looking for
// we add a special datatype specifically for authentication 
// ----------where the Auth type must return a token 
// ----------and can optionally include user data
// query notation data type is:
// ----------type Query {query-name(parameter): data-type} 
// ----------where query-name is the name of the query
// ----------parameter is an optional input into the query
// ----------data-type is the type of data to be returned
// ----------! means data must exist for the query to be carried out
// ----------authentication is added to the Query
// mutation notation is:
// ----------type Mutation {mutation-name(params): data-type
// ----------where the mutation can accept arguments
// ----------and returns the requested information
const typeDefs = gql`

    type User {
        _id: ID
        username: String
        email: String
        friendCount: Int
        thoughts: [Thought]
        friends: [User]
    }

    type Thought {
        _id: ID
        thoughtText: String
        createdAt: String
        username: String
        reactionCount: Int
        reactions: [Reaction]
    }

    type Reaction {
        _id: ID
        reactionBody: String
        createdAt: String
        username: String
    }

    type Auth {
        token: ID!
        user: User
    }

    type Query {
        me: User
        users: [User]
        user(username: String!): User
        thoughts(username: String): [Thought]
        thought(_id: ID!): Thought
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        addThought(thoughtText: String!): Thought
        addReaction(thoughtId: ID!, reactionBody: String!): Thought
        addFriend(friendId: ID!): User
    }
`;

// export the typeDefs
module.exports = typeDefs;