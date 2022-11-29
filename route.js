var express  = require('express');
const app      = express();
const path = require('path');
var bodyParser = require('body-parser'); 

var port     = process.env.PORT || 8000;
require('dotenv').config();
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json


mongoose.connect(database.url);

const RestaurantDB = require('./models/restaurants');
const db = new RestaurantDB();
const { query, validationResult } = require('express-validator');



    /* This route uses the body of the request to add a new "Restaurant" 
 document to the collection */
app.post('/api/restaurants', (req, res) => {
    // MUST return HTTP 201
    db.addNewRestaurant(req.body)
      .then((restaurant) => {
        res.status(201).json({
          _id: restaurant._id,
          message: 'Restaurant added successfully!',
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: `Could not add the restaurant! Error: ${err}`,
        });
      });
  });

  //validation

  const page = req.query('page')
                .isInt({ min: 1 }) // it will check if string is interger or not 
            .withMessage('page param must be the whole number 1 or greater.');
    
 const perPage = req.query('perPage')
                .isInt({ min: 1 }) 
                .withMessage('perPage param must be the whole number 1 or greater.') ;

const borough = req.query('borough').isString().optional();
  
  /* This route returns all "Restaurant" objects for a specific "page" to
 the client as well as optionally filtering by "borough", if provided. */

 app.get('/api/restaurants',page,perPage,borough, (req, res) => {
    
    //Extracts the validation errors from a request and makes them available in a Result object
    const errors = validationResult(req); 
     
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
     
      db.getAllRestaurants(page, perPage, borough)
        .then((data) => {
          res.status(200).json(data);
        })
        .catch((err) => {
          res.status(500).json({
            message: `No restaurant was found! Error: ${err}`,
          });
        });
    }
  );


  /* This route must accept a numeric route parameter that represents the 
 _id of the desired restaurant object to return a specific "Restaurant"
 object to the client. */
app.get('/api/restaurants/:id', (req, res) => {
    let id = req.params.id;
    db.getRestaurantById(id)
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        res.status(500).json({
          message: `No match was found! Error: ${err}`,
        });
      });
  });
  


// This route will update a specific "Restaurant" document in the collection.
app.put('/api/restaurants/:id', (req, res) => {
    let id = req.params.id;
    db.updateRestaurantById(req.body, id)
      .then(() => {
        res.status(204).json({
          message: `The restaurant with id ${id} updated successfully!`,
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: `an error occurred: ${err}`,
        });
      });
  });
  



// This route will will use this value to delete a specific "Restaurant" document
app.delete('/api/restaurants/:id', (req, res) => {
    let id = req.params.id;
    db.deleteRestaurantById(id)
      .then(() => {
         res.status(204).json({
           message: `The restaurant with id ${id} deleted successfully!`,
         });
        res.status(204).end();
      })
      .catch((err) => {
        res.status(500).json({
          message: `an error occurred: ${err}`,
        });
      });
  });

  

   

