var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const restaurantSchema = new Schema({
    address: {
      building: String,
      coord: [Number],
      street: String,
      zipcode: String,
    },
    borough: String,
    cuisine: String,
    grades: [
      {
        date: Date,
        grade: String,
        score: Number,
      },
    ],
    name: String,
    restaurant_id: String,
  });

 