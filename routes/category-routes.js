const express = require("express");
const { check } = require("express-validator");

const categoryControllers=require("../controllers/category-controllers");

const router = express.Router();

router.get("/", categoryControllers.getAllCategories);


router.post(
  "/",
  check("name").not().isEmpty(),
  categoryControllers.createCategory
);


module.exports = router;
