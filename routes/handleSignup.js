const mongoose = require("mongoose");
const { validationResult, matchedData } = require("express-validator");
const User = require("../models/User");
const bcrypt = require('bcrypt');
const saltRounds = 10;

const handleSignup = async (req, res) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    const data = matchedData(req);
    const { name, username, email, password, confirmPassword } = data;

    // hash the password first
    const hashPassword = await bcrypt.hash(password, saltRounds);
    // create new User
    const user = new User({
      name: name,
      email: email,
      username: username,
      password: hashPassword,
    })
    // save user in db
    try {
      const userDb = await user.save()
      return res.send({
        msg: "Account registered successfully!",
        code: "registered",
      });
    } catch (error) {
      if(error.keyPattern.hasOwnProperty('email')) {
        return res.send({
          msg:"Account already exists with this email.",
          code: "emailExists",
        });
      } else if(error.keyPattern.hasOwnProperty('username')) {
        return res.send({
          msg: "Account already exists with this username.",
          code: "usernameExists",
        });
      }

      return res.send({
        name: "Error",
        msg: "Something went wrong",
        errors: error,
      })
    }
    
  }

  res.send({ errors: result.array() });
}

module.exports = handleSignup;

// hash the password
// create new use with User model
// save the user in db