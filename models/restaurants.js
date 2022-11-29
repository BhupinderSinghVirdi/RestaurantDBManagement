// load mongoose since we need it to define a model
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
restaurants = new Schema({
    _id: String,
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