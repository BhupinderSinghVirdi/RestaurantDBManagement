/*********************************************************************************************
 * ITE5315 – Assignment 4* I declare that this assignment is my own work in accordance with Humber Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source
 * (including web sites) or distributed to other students.
 *
 * Name: Bhupinder,Manan,Berk     Date: 11/29/22
 *
 * ******************************************************************************************/

// This file contains all the promise-based methods required for the API
// also these methods are further wired to index.js

const { default: mongoose, connection, model } = require("mongoose");
let restaurants = require("../models/restaurants");
let document, modelSchema;

let methods = {
  initialize: async (connectionString) => {
    await mongoose.connect(connectionString).then();
    modelSchema = mongoose.model("restaurants", restaurants);
  },
  addNewRestaurant: async (data) => {
    document = new modelSchema(data);
    await document.save();
    return document;
  },
  getRestaurantById: async (id) => {
    document = await modelSchema.findOne({ _id: id });
    return document;
  },
  updateRestaurantById: async (data, id) => {
    document = await modelSchema.updateOne({ _id: id }, { $set: data });
    console.log(document);
  },
  deleteRestaurantById: async (id) => {
    await modelSchema.deleteOne({ _id: id }).exec();
  },
  // to be covered in second phase of the project.
  getAllRestaurants: (page, perPage, borough) => {},
};

module.exports = methods;
