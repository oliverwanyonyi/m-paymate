const bcrypt = require("bcryptjs");
const db = require("../models");
const { validationResult } = require("express-validator");
const { checkExistingEmail, checkExistingUsername } = require("../utils/check");
const { generateToken } = require("../utils/token");
const asyncHandler = require("express-async-handler");
const User = db.User;
const sequelize  = require('sequelize')
const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json(errors);
    }
    const { name, username, phone, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const [emailExists, usernameExists] = await Promise.all([
      checkExistingEmail(email),
      checkExistingUsername(username),
    ]);

    if (emailExists || usernameExists) {
      res.status(400);
      throw new Error("User with email or username already exists.");
    } else {
      const newUser = await User.create({
        name,
        username,
        email,
        password: hashedPassword,
        phoneNumber: req.body.phone,
      });

      const token = generateToken(newUser.id);
      res.json({ success: true, user: { ...newUser.dataValues, token } });
    }
  } catch (error) {
    next(error);
  }
};

const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req)

  if(!errors.isEmpty()){
   return res.status(422).json(errors)
  }
  const { email, password } = req.body;

  const user = await User.findOne({
    where: {
      [sequelize.Op.or]: [{ email: email }, { username: email }],
    },
  });
  if (!user) {
    return res.status(400).json({ message: "Invalid Email or Password" });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  console.log(isPasswordValid,user.dataValues);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid Email or Password" });
  }

  const token = generateToken(user.id);
  res.json({ success: true, user: { ...user.dataValues, token } });
});

module.exports = { login, register };
