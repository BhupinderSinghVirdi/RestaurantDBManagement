/*********************************************************************************************
 * ITE5315 – Assignment 4* I declare that this assignment is my own work in accordance with Humber Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source
 * (including web sites) or distributed to other students.
 *
 * Name: Bhupinder,Manan,Berk     Date: 11/29/22
 *
 * ******************************************************************************************/

require("dotenv").config();
const database = process.env.DATABASE;
const username = process.env.USERNAME;
const password = process.env.PASSWORD;
console.log(username)
module.exports = {
  url: `mongodb+srv://admin:${password}@semester3web.0bbcsui.mongodb.net/${database}`
};
