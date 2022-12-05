const { config } = require("dotenv");
const jwt = require("jsonwebtoken");
const { decode } = require("punycode");

const verifyToken = async (req, res, next) => {
  console.log(req.headers);
  
  const token = req.headers['authorization'];
  console.log(token);
  if (!token) {
    return res.status(403).send("A token is required..");
  }

  try {
    console.log( await jwt.verify(token, process.env.TOKEN_KEY));
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
