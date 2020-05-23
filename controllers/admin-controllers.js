const HttpError = require("../models/http-error");

const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");

const getAllAdmins = async (req, res, next) => {
  let admins;
  try {
    admins = await Admin.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "something went wrong on the db, when retriving the admins",
      500
    );
    return next(error);
  }
  res
    .status(200)
    .json({ admins: admins.map((u) => u.toObject({ getters: true })) });
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
    hasRegistered = await Admin.findOne({ email: email });
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
  const newAdmin = new Admin({
    name,
    email,
    password: hashedPassword,
    image: "https://robohash.org/HFB.png?set=set3",
  });

  try {
    await newAdmin.save();
  } catch (err) {
    const error = new HttpError("Sign up process has failed, error on db", 500);
    return next(error);
  }
  let token;
  try {
    token = jwt.sign(
      { userId: newAdmin.id, email: newAdmin.email,role:'admin' },
      "cr-hunter&dasunx",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("sigining up faild, toke creation error!"+err, 500);
    return next(error);
  }

  res
    .status(201)
    .json({ userId: newAdmin.id, email: newAdmin.email, token: token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let identifiedAdmin;
  try {
    identifiedAdmin = await Admin.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("something went wrong on db side!");
    return next(error);
  }
  if (!identifiedAdmin) {
    return next(new HttpError("Email or password is not correct!", 401));
  }
  let isValidPassword;
  try {
    isValidPassword = await bcrypt.compare(password, identifiedAdmin.password);
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
      { userId: identifiedAdmin.id, email: identifiedAdmin.email,role:'admin' },
      "cr-hunter&dasunx",
      { expiresIn: "1h" }
    );
  } catch (err) {
      const error =new HttpError('Logging Failed! something went wrong when creating the token',500);
      return next(error);
  }

  res.json({
    userId:identifiedAdmin.id,email:identifiedAdmin.email,token:token,role:'admin'
  });
};

exports.login = login;
exports.getAllAdmins = getAllAdmins;
exports.signUp = signUp;
