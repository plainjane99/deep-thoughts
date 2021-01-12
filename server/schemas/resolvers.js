// resolvers are the functions we connect to each query or mutation type definition that perform the CRUD operation
// once queries/mutations are set up, set up the resolver that will serve the response of the typeDef query

// import the models
const { User, Thought } = require('../models');

// import error handling for authentication from graphQL (apollo)
// in case a user types in the wrong username or password
const { AuthenticationError } = require('apollo-server-express');

// import signToken for use
const { signToken } = require('../utils/auth');

// define a resolvers object with a Query nested object that holds a series of methods
// the methods are named the same as their respective typeDef query
const resolvers = {
    Query: {
        // authentication
        // parameters include placeholder parent, arg object, and the 'context' with authentication info
        // check for existence of context.user created by authentication middleware we created
        me: async (parent, args, context) => {
            // authentication info exists (context.user is included in the object), then return the user data
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    .select('-__v -password')
                    .populate('thoughts')
                    .populate('friends');

                return userData;
            }
            // If no context.user property exists, then we know that the user isn't authenticated and
            // we can throw an AuthenticationError
            throw new AuthenticationError('Not logged in');
        },
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

    },

    Mutation: {

        addUser: async (parent, args) => {
            // perform a create on the User model with whatever args are passed in
            const user = await User.create(args);
            // create a token and return it with the user data
            const token = signToken(user);

            return { token, user };
        },

        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            // use apollo's error handling to send back to the client if an error is made
            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const correctPw = await user.isCorrectPassword(password);

            // use apollo's error handling to send back to the client if an error is made
            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            // create a token and return it with the user data
            const token = signToken(user);

            return { token, user };

        },

        addThought: async (parent, args, context) => {
            // only if users are logged in will the method run
            if (context.user) {
                // The token includes the user's username, email, and _id properties, which become properties of context.user
                const thought = await Thought.create({ ...args, username: context.user.username });

                await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { thoughts: thought._id } },
                    // return the updated document
                    { new: true }
                );

                return thought;
            }

            throw new AuthenticationError('You need to be logged in!');

        },

        addReaction: async (parent, { thoughtId, reactionBody }, context) => {
            if (context.user) {
                const updatedThought = await Thought.findOneAndUpdate(
                    { _id: thoughtId },
                    // reactions are stored as arrays in the Thought model so we use push
                    { $push: { reactions: { reactionBody, username: context.user.username } } },
                    { new: true, runValidators: true }
                );

                return updatedThought;
            }

            throw new AuthenticationError('You need to be logged in!');
        },

        // This mutation will look for an incoming friendId 
        addFriend: async (parent, { friendId }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    // add incoming friendId to the current user's friends array
                    // A user can't be friends with the same person so we us $addToSet operator instead of $push to prevent duplicate entries
                    { $addToSet: { friends: friendId } },
                    { new: true }
                ).populate('friends');

                return updatedUser;
            }

            throw new AuthenticationError('You need to be logged in!');
        }

    }
};

module.exports = resolvers;