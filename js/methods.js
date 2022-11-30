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

const { Console, clear } = require("console");
const express = require("express");
const { default: mongoose, connection, model } = require("mongoose");
const { resolve } = require("path");
let restaurants = require("../models/restaurants");
let document, modelSchema;

let methods = {
  initialize: async (connectionString) => {
    console.log(connectionString);
    await mongoose.connect(connectionString).then();
    console.log("in resolve");
    modelSchema = mongoose.model("restaurants", restaurants);
    console.log(modelSchema);
  },
  addNewRestaurant: (data) => {
    new Promise(() => {
      document = modelSchema.insertOne(data).exec();
    })
      .then(console.log(record))
      .catch(console.log(err));
  },
  getRestaurantById: async (id) => {
    document = await modelSchema.findOne({ _id: id });
    console.log(record);
    return record;
  },
  updateRestaurantById: (data, id) => {
    modelSchema.updateOne({ _id: id }, { $set: data }).exec();
  },
  deleteRestaurantById: (id) => {
    modelSchema.deleteOne({ _id: id }).exec();
  },
  // to be covered in second phase of the project.
  getAllRestaurants: (page, perPage, borough) => {},
};

module.exports = methods;
