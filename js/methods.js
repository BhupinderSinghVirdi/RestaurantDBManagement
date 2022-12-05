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

const { body } = require("express-validator/src");
const { default: mongoose } = require("mongoose");
let bcrypt = require("bcryptjs");
let jwt = require("jsonwebtoken");
let restaurants = require("../models/restaurants");
let document, modelSchema;
const userSchema = require("../models/users");

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
  getAllRestaurants: async (page, perPage, borough) => {
    if (page && perPage && borough) {
      return await modelSchema
        .find({ borough: borough })
        .sort({ restaurant_id: 1 })
        .skip((page - 1) * +perPage)
        .limit(perPage);
    } else {
      return Promise.reject("Error: Missing parameters in the query string");
    }
  },
  registerUser: async (name, email, password) => {
    const OldUser = await userSchema.findOne({ email });
    console.log(OldUser);
    if (OldUser) {
      return Promise.reject(`User Already Exists, please Login now.`);
    }

    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await userSchema.create({
      name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });

    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    // save user token
    user.token = token;
    // return new user
    return user;
  },
  loginUser: async (email, password) => {
    // Validate if user exist in our database
    const user = await userSchema.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      //Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.token = token;
      // user
      return user;
    } else {
      return Promise.reject("Invalid Credentials");
    }
  },
};

module.exports = methods;
