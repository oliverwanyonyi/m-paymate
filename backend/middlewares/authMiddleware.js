const db = require("../models");
const User = db.User
const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
exports.protect = asyncHandler(async (req, res, next) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {

        token = req.headers.authorization.split(" ")[1];
  
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log(User);
        req.user = await User.findByPk(decoded.id);
        next();
      } catch (error) {
        console.log(error);
        res.status(401).json({message:"Not authorized token failed"});
      
      }
    }
    if (!token) {
      res.status(401);
      throw new Error("Not authorized no token");
    }
  });