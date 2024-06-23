const express = require('express');
const app = express();
// database connection
const mongoose = require("mongoose");
const db = mongoose.connect("mongodb+srv://molinajesus2003:weJyz3uFbpRRcg2M@cluster0.orvrvph.mongodb.net/DB_Aventados");

// parser for the request body (required for the POST and PUT methods)
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// check for cors
const cors = require("cors");
app.use(cors({
  origin: '*',
  methods: "*"
}));


//Import user controller
const {
  userPost,
  userGet,
  userDelete,
  userPatch
} = require("/Controllers/userController.js");

app.post("/api/user",userPost)


app.listen(3001, () => console.log(`Example app listening on port 3001!`))