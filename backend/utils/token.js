const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

exports.generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

