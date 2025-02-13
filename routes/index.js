var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send({
    message:
      "Welcome to the eCommerce Backend API Your API is working condition",
    status: true,
  });
});

module.exports = router;
