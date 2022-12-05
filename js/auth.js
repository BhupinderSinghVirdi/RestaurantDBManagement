/*********************************************************************************************
 * ITE5315 – Assignment 4* I declare that this assignment is my own work in accordance with Humber Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source
 * (including web sites) or distributed to other students.
 *
 * Name: Bhupinder,Manan,Berk     Date: 11/29/22
 *
 * ******************************************************************************************/

const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  console.log(req.headers);
  
  const token = req.headers['authorization'];
  console.log(token);
  if (!token) {
    return res.status(403).send("A token is required..");
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);

    console.log(decoded);
    req.user = decoded;
  } catch (err) {
    console.log(err)
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;
