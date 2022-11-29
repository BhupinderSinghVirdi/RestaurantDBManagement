// This file contains all the promise-based methods required for the API
// also these methods are further wired to index.js

const { ObjectId } = require("bson");
const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const { default: mongoose, connection } = require("mongoose");
const { resolve } = require("path");
const restaurants = require("../models/restaurants");

let methods = {
  initialize: (connectionString) => {
    new Promise((resolve, reject) => {
      connection = mongoose.connect(connectionString);
      connection.once('open', () => {
        this.Restaurant = db.model('restaurants', restaurants);
        resolve();
      });
      connection.once('error', (err) => {
        reject(err);
      });
    });
  },
  addNewRestaurant: (data) => {},
  getAllRestaurants: (page, perPage, borough) => {},
  getRestaurantById: (id) => {
    restaurants.findOne({ _id: id }).exec();
  },
  updateRestaurantByid: (data, id) => {
    restaurants.updateOne({ _id: id }, { $set: data }).exec();
  },
  deleteRestaurantById: (id) => {
    restaurants.deleteOne({ _id: id}).exec();
  },
};

module.exports = methods;
