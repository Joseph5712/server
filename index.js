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
  origin: '*',
  methods: "*"
}));


const {
  rideGet,
  ridePost,
  ridePatch,
  rideDelete
} = require("./Controllers/rideController.js");

// Ride routes
app.post("/api/rides", ridePost);
app.get("/api/rides", rideGet);
app.patch("/api/rides", ridePatch);
app.delete("/api/rides", rideDelete);


const {
  userPost,
  userGet,
  userDelete,
  userPatch
} = require("./Controllers/userController.js");

// User routes
app.post("/api/user", userPost);
app.get("/api/user",userGet)
app.delete("/api/user",userDelete)
app.patch("/api/user",userPatch)


const{
  vehiculePost,
  vehiculeGet,
  vehiculePatch,
  vehiculeDelete
} = require("./Controllers/vehiculeContoller.js");

//Vehicule routes
app.post("/api/vehicule",vehiculePost);
app.get("/api/vehicule",vehiculeGet);
app.patch("/api/vehicule",vehiculePatch);
app.delete("/api/vehicule",vehiculeDelete);



app.listen(3001, () => console.log(`Example app listening on port 3001!`))