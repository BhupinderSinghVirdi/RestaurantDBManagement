0/*********************************************************************************************

 * ITE5315 – Assignment 4* I declare that this assignment is my own work in accordance with Humber Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source
 * (including web sites) or distributed to other students.
 *
 * Name: Bhupinder,Manan,Berk     Date: 11/29/22
 *
 * ******************************************************************************************/

const { ObjectID } = require("bson");
// load mongoose since we need it to define a model
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
restaurants = new Schema({
    _id: ObjectID,
    address: {
        building: String,
        coord: { 
            type: Array, default: []
        },
        street: String,
        zipcode: String
    },
    borough: String,
    cuisine: String,
    grades: [{
            date: Date,
            grade: String,
            Score: Number
        }
    ],
    name: String,
    restaurant_id: String,
});
module.exports = restaurants;