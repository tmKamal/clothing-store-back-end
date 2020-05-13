const express = require("express");
const { check } = require("express-validator");

const productController = require("../controllers/product-controller");

const router = express.Router();

router.get("/:pid", productController.getProductById);

router.get("/category/:cid", productController.getProductsByCategoryId);

router.post(
  "/",
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

router.delete("/:pid", productController.deleteProduct);

module.exports = router;
