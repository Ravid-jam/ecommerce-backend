var express = require("express");
const {
  addColor,
  getAllColors,
  updateColor,
  deleteColor,
} = require("../controller/color.controller");
const authorize = require("../middelware/authorized");

var router = express.Router();

/* GET home page. */
router.get("/getAllColors", getAllColors);
router.post("/addColor", authorize, addColor);
router.put("/updateColor/:id", authorize, updateColor);
router.delete("/deleteColor/:id", authorize, deleteColor);

module.exports = router;
