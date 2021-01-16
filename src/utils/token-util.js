require('dotenv').config();
const jwt = require('jsonwebtoken');

function generateToken(tokenData) {
    const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY });
    return token;
}

function validateToken(token, callback) {
    let success = false;
    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
        if (err) {
            callback({ success, data: err });
        } else {
            success = true;
            callback({ success, data: decoded });
        }
    });
}


module.exports = {
    generateToken: generateToken,
    validateToken: validateToken
}