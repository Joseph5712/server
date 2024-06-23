const express = require('express');
const app = express();
// database connection
const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://josephme5712:9a1Ao5AEy09ewGbC@cluster0.m5sfesz.mongodb.net/DB_Aventones");

// parser for the request body (required for the POST and PUT methods)
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// check for cors
const cors = require("cors");
app.use(cors({
  origin: '*',
  methods: "*"
}));

// Import user controller
const {
  userPost
} = require("./Controllers/userController.js");

// Import ride controller
const {
  rideGet,
  ridePost,
  ridePatch,
  rideDelete
} = require("./Controllers/rideController.js");

// User routes
app.post("/api/user", userPost);

// Ride routes
app.post("/api/rides", ridePost);
app.get("/api/rides", rideGet);
app.patch("/api/rides", ridePatch);
app.delete("/api/rides", rideDelete);

// Start the server
app.listen(3001, () => console.log(`Example app listening on port 3001!`));
