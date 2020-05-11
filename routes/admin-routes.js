const express = require("express");
const { check } = require("express-validator");

const adminControllers = require("../controllers/admin-controllers");

const router = express.Router();

router.get("/", adminControllers.getAllAdmins);
router.post(
  "/signup",
  check("name").not().isEmpty(),
  check("email").normalizeEmail().isEmail(),
  check("password").isLength({ min: 6 }),
  adminControllers.signUp
);
router.post("/login", adminControllers.login);

module.exports = router;
