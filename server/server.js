const express = require('express');
// import ApolloServer
const { ApolloServer } = require('apollo-server-express');

// import our typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas');
// uses the connection created by the imported connection file
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
const app = express();
// create a new Apollo server and pass in our schema data
// we provide the type definitions and resolvers so they know what our API looks like and how it resolves requests
const server = new ApolloServer({
  typeDefs,
  resolvers
});

// integrate our Apollo server (which we defined as server) with the Express application (which we defined as app) as middleware
// This will create a special /graphql endpoint for the Express.js server that will serve as the main endpoint for accessing the entire API
server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// when we run our server, we listen for the mongoose connection to be made
// open a successful connection, the server is started
db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    // log where we can go to test our GQL API
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});
