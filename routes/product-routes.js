const express = require("express");
const { check } = require("express-validator");
const fileUpload=require("../middleware/file-upload");
const productController = require("../controllers/product-controller");
const authentication=require("../middleware/authentication");

const router = express.Router();

router.get("/:pid", productController.getProductById);

router.get("/category/:cid", productController.getProductsByCategoryId);

router.get("/products/all",productController.getAllProducts);


router.patch(
  "/:pid",
  check("name").not().isEmpty(),
  check("price").not().isEmpty(),
  check("discount").not().isEmpty(),
  check("qty").not().isEmpty(),
  
  productController.updateProduct
);
router.delete("/:pid", productController.deleteProduct);
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




router.patch('/addreview/:pid', productController.addReview);


module.exports = router;
