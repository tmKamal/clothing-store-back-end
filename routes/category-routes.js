const express = require("express");
const { check } = require("express-validator");
const authentication =require("../middleware/authentication");

const categoryControllers=require("../controllers/category-controllers");
const fileUpload=require("../middleware/file-upload");
const router = express.Router();

router.get("/", categoryControllers.getAllCategories);

router.use(authentication);//authentication middleware 
router.post(
  "/",
  fileUpload.single('image'),
  check("name").not().isEmpty(),
  categoryControllers.createCategory
);


module.exports = router;
