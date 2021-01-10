// resolvers are the functions we connect to each query or mutation type definition that perform the CRUD operation
// once queries/mutations are set up, set up the resolver that will serve the response of the typeDef query

// import the models
const { User, Thought } = require('../models');

// define a resolvers object with a Query nested object that holds a series of methods
// the methods are named the same as their respective typeDef query
const resolvers = {
    Query: {
        // the method has the same name as the respective query
        // the resolver function accepts the parent and arg parameters
        // where 'parent' is a placeholder parameter (it will not be used but we need a param in the first spot)
        // and 'arg' is an object of all the model's key values that is passed into the query
        // 'username' is the param we want to access so it is destructured from the 'arg' object
        thoughts: async (parent, { username }) => {

            // check if second param (username) exists through use of a ternary operator
            // if 'username' exists, assign it to 'params'
            const params = username ? { username } : {};
            // perform a 'find' on the Thought model
            // if params exists, use that parameter
            // return the thought data in descending order
            return Thought.find(params).sort({ createdAt: -1 });
        },

        // single thought method
        // 'parent' placeholder
        // '_id' param destructured from thought object
        thought: async (parent, { _id }) => {
            // Thought model
            // findOne method
            // using thought id
            return Thought.findOne({ _id });
        },

        // get all users
        users: async () => {
            return User.find()
                // omit the Mongoose-specific __v property
                // omit password information
                .select('-__v -password')
                // include friends and thoughts data
                .populate('friends')
                .populate('thoughts');
        },
        // get a user by username
        user: async (parent, { username }) => {
            return User.findOne({ username })
                .select('-__v -password')
                .populate('friends')
                .populate('thoughts');
        }

    }
};

module.exports = resolvers;