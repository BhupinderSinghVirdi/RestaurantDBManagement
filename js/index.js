/*********************************************************************************************
 * ITE5315 – Assignment 4* I declare that this assignment is my own work in accordance with Humber Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source
 * (including web sites) or distributed to other students.
 *
 * Name: Bhupinder,Manan,Berk     Date: 11/29/22
 *
 * ******************************************************************************************/

var express = require("express");
const app = express();
const path = require("path");
var bodyParser = require("body-parser");
const db = require("./methods");
let connect_url = require("../config/database");
const { query, validationResult } = require("express-validator");
const { url } = require("inspector");

var port = process.env.PORT || 8000;
require("dotenv").config();
app.use(bodyParser.urlencoded({ extended: "true" })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: "application/vnd.api+json" })); // parse application/vnd.api+json as json

require("dotenv").config();
// query validation

//mongoose.connect(database.url);

//this module the following routes to Our WEB api

/*
    Route for the api to get a particular restaurant with it's id
*/
app.get("/api/restaurants/:id", (req, res) => {
  let id = req.params.id;
  db.getRestaurantById(id)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(500).json({
        message: `Server error: ${err}`,
      });
    });
});

/*
    Route for the api to insert a particular restaurant(document).
*/
app.post("/api/restaurants", (req, res) => {
  // MUST return HTTP 201
  db.addNewRestaurant(req.body)
    .then((restaurant) => {
      res.status(201).json({
        _id: restaurant._id,
        message: "Record added!",
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: `Server error: ${err}`,
      });
    });
});

/*
    Route for the api to update a particular restaurant with it's id as the search filter and data as the upsert argument
*/
app.put("/api/restaurants/:id", (req, res) => {
  let id = req.params.id;
  db.updateRestaurantById(req.body, id)
    .then(() => {
      res.sendStatus(204).json({
        message: `The record with id ${id} updated successfully!`,
      });
    })
    .catch((err) => {
      res.sendStatus(500).json({
        message: `Server error: ${err}`,
      });
    });
});

/*
    Route for the api to delete a particular restaurant(document) with it's id as the search filter
*/
app.delete("/api/restaurants/:id", (req, res) => {
  let id = req.params.id;
  db.deleteRestaurantById(id)
    .then(() => {
      res.sendStatus(204).json({
        message: `The restaurant with id ${id} deleted successfully!`,
      });
      res.status(204).end();
    })
    .catch((err) => {
      res.sendStatus(500).json({
        message: `Server error: ${err}`,
      });
    });
});

db.initialize(connect_url.url)
  .then(() => {
    app.listen(port), console.log("App listening on port : " + port);
  })
  .catch((err) => {
    res.sendStatus(500).json({
      message: `Server error: ${err}`,
    });
  });
