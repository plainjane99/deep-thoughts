const express = require('express');
// import ApolloServer
const { ApolloServer } = require('apollo-server-express');
const path = require('path');

// import our typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas');
// uses the connection created by the imported connection file
const db = require('./config/connection');

// import the authentication middleware
const { authMiddleware } = require('./utils/auth');

const PORT = process.env.PORT || 3001;
const app = express();

// create a new Apollo server and pass in our schema data
// we provide the type definitions and resolvers so they know what our API looks like and how it resolves requests
// we can also pass in a method when we instantiate a new instance of ApolloServer
// we add authentication through middleware to ensure that every request performs an authentication check
// and the updated request object will be passed to the resolvers as 'context'
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});

// integrate our Apollo server (which we defined as server) with the Express application (which we defined as app) as middleware
// This will create a special /graphql endpoint for the Express.js server that will serve as the main endpoint for accessing the entire API
server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// serve up the React front-end code in production
// check to see if the Node environment is in production. 
// If it is, instruct Express.js server to serve any files in the React application's build directory in the client folder
// Serve up static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// serve up the React front-end code in production
// wildcard GET route for the server
// if we make a GET request to any location on the server that doesn't have an explicit route defined,
// respond with the production-ready React front-end code
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// when we run our server, we listen for the mongoose connection to be made
// open a successful connection, the server is started
db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    // log where we can go to test our GQL API
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});
