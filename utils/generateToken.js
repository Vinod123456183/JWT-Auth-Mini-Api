const jwt = require("jsonwebtoken");

const generateToken = (data) => {
  console.log(process.env.JWT_SECRET);
  return jwt.sign(data, process.env.JWT_SECRET);
};

module.exports = generateToken;
