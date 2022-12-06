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
var bodyParser = require("body-parser");
const db = require("./methods");
let connect_url = require("../config/database");
const { query, validationResult } = require("express-validator");
const { url } = require("inspector");
const auth = require("../js/auth.js");
const exphbs = require("express-handlebars");
const localStorage = require("node-localStorage").localStorage;

var port = process.env.PORT || 8000;
require("dotenv").config();
app.use(bodyParser.urlencoded({ extended: "true" })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: "application/vnd.api+json" })); // parse application/vnd.api+json as json

require("dotenv").config();

const HBS = exphbs.create({
  //Create custom HELPER
  helpers: {
    sample: function () {
      return 100;
    },
    calculation: function (num) {
      return (calculation = num + 10);
    },
    strong: function (options) {
      return "<strong>" + options.fn(this);
    },
  },
});

app.engine(".hbs", HBS.engine);
app.set("view engine", ".hbs");

/*
 ***********************************************************************************************************************************
 */

// UI routes :

/*
  Route to Make login page as the landing page of the application
*/

app.get("/", (req, res) => {
  res.redirect("/api/login");
});

/*
  Route to get the static html page for User to login into the application
*/

app.get("/api/login", (req, res) => {
  res.sendFile(
    "C:/Users/Bhupinder/Documents/GitHub/RestaurantDBManagement/views/login.html"
  );
  // res.render("login",{
  //   data: {},
  //   layout: false
  // })
});

app.post("/api/login", (req, res) => {
  const { name, email, password } = req.body;

  if (!(name && email && password)) {
    res.status(400).json({
      message: `Bad Request. Please provide all details in the request.`,
    });
  }

  db.registerUser(name, email, password)
    .then((data) => {
      res
        .cookie("token", data.token)
        .status(200)
        .redirect("/api/displayRestuarantsDetails");
    })
    .catch((err) => {
      res.status(500).json({
        message: `Server error: ${err}`,
      });
    });
});

app.get("/api/displayRestuarantsDetails", auth, (req, res) => {
  res.sendFile(
    "C:/Users/Bhupinder/Documents/GitHub/RestaurantDBManagement/views/displayRestuarants.html"
  );

  // res.render("Table", {
  //   data: {},
  //   layout: false
  // });
});

app.get("/api/displayRestuarants", auth, (req, res) => {
  let page = req.query.page;
  let perPage = req.query.perPage;
  let borough = req.query.borough;

  db.getAllRestaurants(page, perPage, borough)
    .then((data) => {
      res.status(200).json({ data });
    })
    .catch((err) => {
      res.status(500).json({
        message: `Server error: ${err}`,
      });
    });
});

/*
 **********************************************************************************************************************************
 */
//this module the following routes to Our WEB api

/*
  Route to add the user to DB to gather the entered password
*/
app.post("/api/restaurantusers/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!(name && email && password)) {
    res.status(400).json({
      message: `Bad Request. Please provide all details in the request.`,
    });
  }

  db.registerUser(name, email, password)
    .then((data) => {
      res.status(200).json({ data });
    })
    .catch((err) => {
      res.status(500).json({
        message: `Server error: ${err}`,
      });
    });
});

/*
  Route to verify the password and generate auth token for other routes
*/
app.post("/api/restaurantusers/login", (req, res) => {
  const { email, password } = req.body;

  // Validate user input
  if (!(email && password)) {
    res.status(400).json({
      message: `All input is required`,
    });
  }
  db.loginUser(email, password)
    .then((data) => {
      res.header.set("token", data.token);
      res.cookie("token", data.token).status(200).json({ data });
    })
    .catch((err) => {
      res.status(500).json({
        message: `Server error: ${err}`,
      });
    });
});

/*
    Route for the api to get restaurants in sorted by restaurant id but search done with page, pageNumber and Borough parameters
*/
app.get("/api/restaurants", auth, (req, res) => {
  let page = req.query.page;
  let perPage = req.query.perPage;
  let borough = req.query.borough;

  db.getAllRestaurants(page, perPage, borough)
    .then((data) => {
      res.status(200).json({ data });
    })
    .catch((err) => {
      res.status(500).json({
        message: `Server error: ${err}`,
      });
    });
});

/*
    Route for the api to get a particular restaurant with it's id
*/
app.get("/api/restaurants/:id", auth, (req, res) => {
  let id = req.params.id;
  db.getRestaurantById(id)
    .then((data) => {
      res.status(200).json({ data });
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
app.post("/api/restaurants", auth, (req, res) => {
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
app.put("/api/restaurants/:id", auth, (req, res) => {
  let id = req.params.id;
  db.updateRestaurantById(req.body, id)
    .then(() => {
      res.status(204).json({
        message: `The record with id ${id} updated successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: `Server error: ${err}`,
      });
    });
});

/*
    Route for the api to delete a particular restaurant(document) with it's id as the search filter
*/
app.delete("/api/restaurants/:id", auth, (req, res) => {
  let id = req.params.id;
  db.deleteRestaurantById(id)
    .then(() => {
      res.status(204).json({
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

app.get("*", function (req, res) {
  res.render("error", {
    title: "Error",
    message: "Wrong Route",
    layout: false,
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
