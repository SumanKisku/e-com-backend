// imports
const express = require("express");
const app = express();
const cors = require("cors");
const clc = require("cli-color");
const mongoose = require("mongoose");
const { body } = require("express-validator");
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

require("dotenv").config();

// routes import
const handleSignup = require("./routes/handleSignup.js");
const handleLogin = require("./routes/handleLogin.js");

// variables
const port = process.env.PORT || 3005;
const notice = clc.blue;
const warning = clc.red;
const dbUsername = process.env.MONGO_USERNAME; // mongodb username
const dbPwd = process.env.MONGO_PASSWORD; // mongodb password
const MONGO_URI = `mongodb+srv://${dbUsername}:${dbPwd}@cluster0.7nxa6go.mongodb.net/e-commerce`;

// mongoDb session store
const store = new MongoDBStore({
  uri: MONGO_URI,
  collection: 'sessions'
});

// if error occurs
store.on('error', function (error) {
  console.log(error);
});

// app was not storing without this options
const corsOptions = {
  origin: 'http://192.168.29.126:3000', // Replace with your React app's URL
  credentials: true,
};

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(session({
  secret: "My secret key",
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: {
    secure: false, // Set to false for HTTP
  },

}))

// connect to mongodb database
mongoose.connect(MONGO_URI).then(() => {
  console.log(notice.bold("MongoDB connected"));
}).catch((error) => {
  console.log(warning.bold(error));
})

// routes
// signup
app.post('/signup', body(['name', 'username', 'email', 'password', 'confirmPassword']).notEmpty(), body('email').isEmail(), handleSignup);

// login
app.post('/login', body(['emailOrUsername', 'password']).notEmpty(), handleLogin);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(notice.blue.bold(`App is running on `), notice.blue.bold.underline(`http://localhost:${port}`));
})
