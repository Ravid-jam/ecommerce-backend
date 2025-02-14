var express = require("express");
const {
  getAllProducts,
  addProduct,
  deleteProduct,
  updatedProduct,
} = require("../controller/product.controller");
var router = express.Router();

/* GET home page. */
router.get("/getAllProducts", getAllProducts);
router.post("/addProduct", addProduct);
router.put("/updateProduct/:id", updatedProduct);
router.delete("/deleteProduct/:id", deleteProduct);

module.exports = router;
