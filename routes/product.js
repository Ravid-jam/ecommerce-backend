var express = require("express");
const {
  getAllProducts,
  addProduct,
} = require("../controller/product.controller");
var router = express.Router();

/* GET home page. */
router.get("/getAllProducts", getAllProducts);
router.post("/addProduct", addProduct);

module.exports = router;
