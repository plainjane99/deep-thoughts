// we will use JSON Web Token for authentication
// i.e. support users who are already logged in
// JSON Web Tokens are especially useful because:
// ***JWT's contain all the data you need encoded into a single string.
// ***JWT's eliminate the need to save a session ID on the back end or in the database.
// ***JWT's decrease the amount of server-side resources needed to maintain authentication.
// ***JWT's can be generated anywhere and aren't tied to a single domain like cookies.

// import jsonwebtoken (from npm install jsonwebtoken)
const jwt = require('jsonwebtoken');

// optionally, tokens can be given an expiration and a secret to sign the token with
// secret merely enables the server to verify whether it recognizes this token
const secret = 'mysecretsshhhhh';
const expiration = '2h';


// export
module.exports = {
    // signToken function expects a user object with username, email, id
    signToken: function ({ username, email, _id }) {
        // assign the passed-in params to payload
        const payload = { username, email, _id };
        // adds params via payload to the jwt
        return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
    },

    // 21.2.5 explains this poorly.  read again later.
    // create a authentication middleware to handle the jwt token
    // request object brought into function
    authMiddleware: function({ req }) {
        // allows token to be sent via req.body, req.query, or headers
        // assigns the token variable if authorization exists
        let token = req.body.token || req.query.token || req.headers.authorization;
    
        // we are bringing in tokens via headers
        // separate "Bearer" from "<tokenvalue>"
        if (req.headers.authorization) {
            // this assigns the variable token to the split off portion
            token = token
                .split(' ')
                .pop()
                .trim();
        }
    
        // if no token, return request object as is
        if (!token) {
            return req;
        }
    
        try {
            // if the secret on jwt.verify() doesn't match the secret that was used with jwt.sign(),
            // the object won't be decoded
            // decode and attach user data to request object
            const { data } = jwt.verify(token, secret, { maxAge: expiration });
            // the decoded JWT is only added to context if the verification passes
            req.user = data;
        } catch {
            // When the JWT verification fails, an error is thrown
            console.log('Invalid token');
        }
    
        // return updated request object
        return req;
    }
    
};