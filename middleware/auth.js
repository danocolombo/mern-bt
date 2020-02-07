const jwt = require('jsonwebtoken');
const config = require('config');

//=========================================
// this is custom middleware for checking
// if token is valid.
//
//==========================================
// if you want to use Facebook, Twitter, etc.
// you can install passport module and use it
// but can be overkill for simple user system

module.exports = function(req, res, next) {
    //get token from header
    const token = req.header('x-auth-token');

    //check if no token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    //if we have token verify it.
    try {
        const decoded = jwt.verify(token, config.get('jwtToken'));
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
