// This file contains all the promise-based methods required for the API
// also these methods are further wired to index.js

const { ObjectId } = require("bson");
const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const { default: mongoose, connection } = require("mongoose");
const { resolve } = require("path");
const restaurants = require("../models/restaurants");
let record;

let methods = {
  initialize: (connectionString) => {
    new Promise((resolve, reject) => {
      connection = mongoose.connect(connectionString);
      console.log(connection);
      connection.once("open", () => {
        mongoose.model("restaurants", restaurants);
        resolve();
      });
      connection.once("error", (err) => {
        reject(err);
      });
    });
  },
  addNewRestaurant: (data) => {
    new Promise(() => {
        record = restaurants.insertOne(data).exec();
      })
        .then(console.log(record))
        .catch(console.log(err));

  },
  getRestaurantById: (id) => {
    new Promise(() => {
      record = restaurants.findOne({ _id: id }).exec();
    })
      .then(console.log(record))
      .catch(console.log(err));
  },
  updateRestaurantByid: (data, id) => {
    new Promise(() => {
        restaurants.updateOne({ _id: id }, { $set: data }).exec();
    })
      .then(console.log(record))
      .catch(console.log(err));
  },
  deleteRestaurantById: (id) => {
    restaurants.deleteOne({ _id: id }).exec();
  },
  // to be covered in second phase of the project.
  getAllRestaurants: (page, perPage, borough) => {},
};

module.exports = methods;
