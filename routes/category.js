var express = require("express");
const {
  GetCategories,
  UpdateCategory,
  DeleteCategory,
  CreateCategory,
} = require("../controller/category.controller.js");
const authorize = require("../middelware/authorized.js");
const {
  getSubCategories,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
} = require("../controller/subCategory.controller.js");
const {
  getPataCategories,
  createPataCategory,
  updatePataCategory,
  deletePataCategory,
} = require("../controller/pataCategory.controller.js");
var router = express.Router();

// category
router.get("/getCategory", GetCategories);
router.post("/addCategory", authorize, CreateCategory);
router.put("/updateCategory/:id", authorize, UpdateCategory);
router.delete("/deleteCategory/:id", authorize, DeleteCategory);

//subCategory
router.get("/getSubCategory", getSubCategories);
router.post("/addSubCategory", authorize, createSubCategory);
router.put("/updateSubCategory/:id", authorize, updateSubCategory);
router.delete("/deleteSubCategory/:id", authorize, deleteSubCategory);

//pataCategory
router.get("/getPataCategory", getPataCategories);
router.post("/addPataCategory", authorize, createPataCategory);
router.put("/updatePataCategory/:id", authorize, updatePataCategory);
router.delete("/deletePataCategory/:id", authorize, deletePataCategory);

module.exports = router;
