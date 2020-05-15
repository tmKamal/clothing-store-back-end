const {validationResult}=require("express-validator");
const mongoose=require('mongoose');//this is only imported for the session and the transaction thing. place-schema handles the all other things. 

const HttpError = require("../models/http-error");

const Product=require("../models/product");
const Category=require('../models/category');

const getProductById =async (req, res, next) => {
  const pid = req.params.pid;
  let product;
  try{
    product =await Product.findById(pid);
  }catch(err){
    const error=new HttpError('Something went wrong on DB',500);
    return next(error);
  }

  if (!product) {
    return next(new HttpError("No product found for the given id!!", 404));
  }
  res.json({ product:product.toObject({getters:true}) });
};

const getProductsByCategoryId = async (req, res, next) => {
  const cid = req.params.cid;
  let categoryWithProducts;
  try{
    categoryWithProducts =await Category.findById(cid).populate('products');

  }catch(err){
    const error=new HttpError('something went wrong on DB, when finding the given category ID',500);
    return next(error);
  }

  if (!categoryWithProducts || categoryWithProducts.products.length === 0) {
    return next(new HttpError("no products found for the given category id", 404));
  }

  res.json({ products:categoryWithProducts.products.map(product=>product.toObject({getters:true})) }); 
};

const createProduct = async(req, res, next) => {
  const validationErrors=validationResult(req);
  if(!validationErrors.isEmpty()){
    return next(new HttpError("Please fill out all the fields carefully.", 422));
  }
  const { name, price, discount, qty,category } = req.body;
  let fileUrl = req.file.path.replace(/\\/g, "/");
  const newProduct = new Product({
    name,
    price,
    discount,
    image:fileUrl,
    qty,
    category
  });

  let selectedCategory;
  try{
    selectedCategory =await Category.findById(category);
  }catch(err){
    const error =new HttpError('something went wrong on the db side when trying to retrive the related category for the product from the db',500);
    return next(error);
  }

  if(!selectedCategory){
    const error=new HttpError('category doesnt exists.',500);
    return next(error);
  }
  console.log(selectedCategory);

  try{
    
    const sess=await mongoose.startSession();
    sess.startTransaction();
    await newProduct.save({session:sess});
    selectedCategory.products.push(newProduct);
    await selectedCategory.save({session:sess});
    sess.commitTransaction();
  }catch(err){
    const error=new HttpError('creating product failed, please try again',500);
    return next(error);
  }

  res.status(201).json({ product: newProduct });
};

const updateProduct = async(req, res, next) => {
  validationErrors=validationResult(req);
  if(!validationErrors.isEmpty()){
    return next(new HttpError("Please update the fields carefully.", 422));
  }
  const productId = req.params.pid;
  const { name, price, discount, qty } = req.body;
  let selectedProduct;
  try{
    selectedProduct =await Product.findById(productId); 
  }catch(err){
    const error=new HttpError('something went wrong on db side, when finding the product id',500);
    return next(error);
  }
  selectedProduct.name = name;
  selectedProduct.price = price;
  selectedProduct.discount=discount;
  selectedProduct.qty=qty;

  try{
    await selectedProduct.save();
  }catch(err){
    const error=new HttpError('something went wrong on db side',500);
    return next(error);
  }
  
  res.status(200).json({ product: selectedProduct.toObject({getters:true}) });
};

const deleteProduct =async (req, res, next) => {
  const productId = req.params.pid;
  let selectedProduct;
  try{
    selectedProduct=await Product.findById(productId).populate('category');
    
  }catch(err){
    const error=new HttpError('something went wrong on db side, when finding the given product id');
    return next(error);
  }
  
  if(!selectedProduct){
    return next(new HttpError("there is no record for the given product id",404));
  }
  
  
  try{
    const sess=await mongoose.startSession();
    sess.startTransaction();
    await selectedProduct.remove({session:sess});
    selectedProduct.category.products.pull(selectedProduct);
    await selectedProduct.category.save({session:sess});
    sess.commitTransaction();
  }catch(err){
    const error=new HttpError('couldnt delete the record, something went wrong on db side');
    return next(error);
  }

  res.status(200).json({ product: "Product has been deleted" });
};

exports.getProductById = getProductById;
exports.getProductsByCategoryId = getProductsByCategoryId;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct  = deleteProduct ;
