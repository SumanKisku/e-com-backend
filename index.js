// imports
const express = require("express");
const app = express();
const cors = require("cors");
const clc = require("cli-color");
const mongoose = require("mongoose");
const { body } = require("express-validator");
require("dotenv").config();

// routes import
const handleSignup = require("./routes/handleSignup.js");

// variables
const port = process.env.PORT || 3001;
const notice = clc.blue;
const warning = clc.red;
const dbUsername = process.env.MONGO_USERNAME; // mongodb username
const dbPwd = process.env.MONGO_PASSWORD; // mongodb password
const MONGO_URI = `mongodb+srv://${dbUsername}:${dbPwd}@cluster0.7nxa6go.mongodb.net/e-commerce`;


// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// connect to mongodb database
mongoose.connect(MONGO_URI).then(() => {
  console.log(notice.bold("MongoDB connected"));
}).catch((error) => {
  console.log(warning.bold(error));
})

// routes
app.post('/signup', body(['name', 'username', 'email', 'password', 'confirmPassword']).notEmpty(), body('email').isEmail(), handleSignup);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(notice.blue.bold(`App is running on `), notice.blue.bold.underline(`http://localhost:${port}`));
})
