const expressJwt = require('express-jwt');


// Express JWT that Will Makes US a Protected Route Middleware and return Req.User from Token
exports.RequireSignIn = expressJwt({
    secret: process.env.APPLICATION_SECRET_KEY,
    algorithms: ["HS256"]
});
