const express = require('express');
const app = express();
// database connection
const mongoose = require("mongoose");
const db = mongoose.connect("mongodb+srv://josephme5712:9a1Ao5AEy09ewGbC@cluster0.m5sfesz.mongodb.net/DB_Aventones");

// parser for the request body (required for the POST and PUT methods)
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// check for cors
const cors = require("cors");
app.use(cors({
  domains: '*',
  methods: "*"
}));

app.listen(3001, () => console.log(`Example app listening on port 3001!`))