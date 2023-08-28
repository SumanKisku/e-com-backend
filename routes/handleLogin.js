const validator = require("validator");
const bcrypt = require('bcrypt');


// Models import
const User = require("../models/User");

const handleLogin = async (req, res) => {
    const { emailOrUsername, password} = req.body;

    let userDb;

    try {
        if (validator.isEmail(emailOrUsername)) {
            userDb = await User.findOne({ email: emailOrUsername });
        } else {
            userDb = await User.findOne({ username: emailOrUsername });
        }

        if(!userDb) {
            return res.send({
                status: 401,
                message: "No account found",
                code: "account",
            })
        }

        let match = await bcrypt.compare(password, userDb.password);
        
        if(!match) {
            return res.send({
                status: 401,
                message: "Password doesn't match. Try again.",
                code: "password",
            })
        }

        //  setting session
        req.session.isAuth = true;
        req.session.user = {
            username: userDb.username,
            email: userDb.email,
            userId: userDb._id
        }
        // console.log("login", res.session.isAuth);
        // console.log("login", req.session.user);
        return res.send({
            status: 200,
            message: "Logged in successfully!",
            code: "loggedIn",
        })

    } catch(error) {
        return res.send({
            status: 500,
            message: "Something went wrong. Internal server error.",
            code: "server"
        })
    }
}

module.exports = handleLogin;

// set userDb
// match the password and hashPassword
// if doesn't match then send an msg
// if matches then create session id