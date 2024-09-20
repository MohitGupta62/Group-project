const express = require("express");
const {homepage} = require("../controllers/adminController")
const router = express.Router();

//homepage
router.get("/", homepage);

module.exports = router;