const express = require("express");
const { check } = require("express-validator");

const managerControllers = require("../controllers/manager-controllers");

const router = express.Router();



router.post("/login", managerControllers.login);

module.exports = router;
