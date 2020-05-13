const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const Category = require("../models/category");
const url = require('url');

const getAllCategories = async (req, res, next) => {
  let categories;
  try {
    categories = await Category.find();
  } catch (err) {
    const error = new HttpError(
      "something went wrong on the db, when retriving the Categories",
      500
    );
    return next(error);
  }
  res
    .status(200)
    .json({ categories: categories.map((u) => u.toObject({ getters: true })) });
};

const createCategory = async (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return next(
      new HttpError("Please fill out all the fields carefully.", 422)
    );
  }
  const { name } = req.body;
  let fileUrl = req.file.path.replace(/\\/g, "/");
  const newCategory = new Category({
    name,
    image: fileUrl,
    products:[]
  });

  try {
    await newCategory.save();
  } catch (err) {
    const error = new HttpError("Category has not created successfully, error on db", 500);
    return next(error);
  }

  res.status(201).json({category:newCategory.toObject({getters:true})});
};




exports.getAllCategories=getAllCategories;
exports.createCategory=createCategory;