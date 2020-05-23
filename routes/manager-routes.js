const express = require("express");
const { check } = require("express-validator");

const managerControllers = require("../controllers/manager-controllers");

const router = express.Router();



router.post("/login", managerControllers.login);
router.post(
    "/signup",
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 4 }),
    managerControllers.signUp
  );

module.exports = router;
