const express = require("express");
const { check } = require("express-validator");
const fileUpload=require("../middleware/file-upload");
const productController = require("../controllers/product-controller");
const authentication=require("../middleware/authentication");

const router = express.Router();

router.get("/:pid", productController.getProductById);

router.get("/category/:cid", productController.getProductsByCategoryId);

router.use(authentication);//authentication middleware 

router.post(
  "/",
  fileUpload.single('image'),
  check("name").not().isEmpty(),
  check("price").not().isEmpty(),
  check("discount").not().isEmpty(),
  check("qty").not().isEmpty(),
  check("category").not().isEmpty(),
  productController.createProduct
);

router.patch(
  "/:pid",
  check("name").not().isEmpty(),
  check("price").not().isEmpty(),
  check("discount").not().isEmpty(),
  check("qty").not().isEmpty(),
  
  productController.updateProduct
);


router.patch('/addreview/:pid', productController.addReview);
router.delete("/:pid", productController.deleteProduct);

module.exports = router;
