const HttpError = require("../models/http-error");

const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const Manager = require("../models/manager");
const jwt = require("jsonwebtoken");

const getAllManagers = async (req, res, next) => {
  let managers;
  try {
    managers = await Manager.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "something went wrong on the db, when retriving the managers",
      500
    );
    return next(error);
  }
  res
    .status(200)
    .json({ managers: managers.map((u) => u.toObject({ getters: true })) });
};

const signUp = async (req, res, next) => {
    const validationError = validationResult(req);
    if (!validationError.isEmpty()) {
      return next(
        new HttpError("Please fill out all the fields carefully.", 422)
      );
    }
    const { name, email, password } = req.body;
    let hasRegistered;
    try {
      hasRegistered = await Manager.findOne({ email: email });
    } catch (err) {
      const error = new HttpError("something went wrong on db side");
      return next(error);
    }
    if (hasRegistered) {
      return next(
        new HttpError("Email is not available! use a different one!!", 422)
      );
    }
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
      const error = new HttpError("Password hashing has faild.", 500);
      return next(error);
    }
    const newManager = new Manager({
      name,
      email,
      password: hashedPassword,
      image: "https://robohash.org/HFB.png?set=set3",
    });
  
    try {
      await newManager.save();
    } catch (err) {
      const error = new HttpError("Manager creation process has failed, error on db", 500);
      return next(error);
    }
    res
      .status(201)
      .json({ msg:'Manager has been created successfully.' });
  };

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let identifiedManager;
  try {
    identifiedManager = await Manager.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("something went wrong on db side!");
    return next(error);
  }
  if (!identifiedManager) {
    return next(new HttpError("Email or password is not correct!", 401));
  }
  let isValidPassword;
  try {
    isValidPassword = await bcrypt.compare(password, identifiedManager.password);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong when comparing the passwords",
      500
    );
    return next(error);
  }
  if (!isValidPassword) {
    return next(new HttpError("Email or password is not correct!", 401));
  }
  let token;
  try {
    token = jwt.sign(
      { userId: identifiedManager.id, email: identifiedManager.email,role:'manager' },
      "cr-hunter&dasunx",
      { expiresIn: "1h" }
    );
  } catch (err) {
      const error =new HttpError('Logging Failed! something went wrong when creating the token',500);
      return next(error);
  }

  res.json({
    userId:identifiedManager.id,email:identifiedManager.email,token:token,role:'manager'
  });
};

exports.login = login;
exports.getAllManagers = getAllManagers;
exports.signUp=signUp;

