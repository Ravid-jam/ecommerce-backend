var express = require("express");
const authorize = require("../middelware/authorized");
const {
  getAllSizes,
  addSize,
  updateSize,
  deleteSize,
} = require("../controller/size.controller");

var router = express.Router();

/* GET home page. */
router.get("/getAllSize", getAllSizes);
router.post("/addSize", authorize, addSize);
router.put("/updateSize/:id", authorize, updateSize);
router.delete("/deleteSize/:id", authorize, deleteSize);

module.exports = router;
