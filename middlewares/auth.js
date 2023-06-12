const jwt = require("jsonwebtoken");
const { blacklist } = require("../blacklistt/blacklist");
require("dotenv").config();
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (blacklist.includes(token)) {
    res.status(400).json({ msg: "Please login again" });
  }
  var decoded = jwt.verify(token, `${process.env.secretKey}`);
  if (decoded) {
    next();
  } else {
    res.status(400).json({ msg: "Please login Again" });
  }
};

module.exports = { auth };
