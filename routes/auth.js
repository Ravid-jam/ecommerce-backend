var express = require("express");
const { Register, Login } = require("../controller/user.controller");

var router = express.Router();

router.post("/register", Register);
router.post("/login", Login);

module.exports = router;
