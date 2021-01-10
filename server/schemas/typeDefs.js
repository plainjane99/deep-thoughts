// definition type
// literally defining every piece of data that the client can expect to work with through a query (get request) or mutation (put, post, delete request)
// this defines the api endpoint but also the exact data and parameters that are tied to that endpoint

// import the gql tagged template function
// tagged templates are an advanced use of template literals
const { gql } = require('apollo-server-express');

// all of our type definitions will go into the tagged template function
// create our typeDefs
// ---------- we define the datatype (model) that is to be returned:
// so that we always have the data we are looking for
// ---------- query notation data type is:
// type Query {query-name(parameter): data-type} 
// where query-name is the name of the query
// parameter is an optional input into the query
// data-type is the type of data to be returned
// ! means data must exist for the query to be carried out
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

    type Query {
        users: [User]
        user(username: String!): User
        thoughts(username: String): [Thought]
        thought(_id: ID!): Thought
    }
`;

// export the typeDefs
module.exports = typeDefs;