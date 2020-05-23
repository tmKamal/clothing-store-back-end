const HttpError = require("../models/http-error");

const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "something went wrong on the db, when retriving the users",
      500
    );
    return next(error);
  }
  res
    .status(200)
    .json({ users: users.map((u) => u.toObject({ getters: true })) });
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
    hasRegistered = await User.findOne({ email: email });
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
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    image: "https://robohash.org/HFB.png?set=set3",
  });

  try {
    await newUser.save();
  } catch (err) {
    const error = new HttpError("Sign up process has failed, error on db", 500);
    return next(error);
  }
  let token;
  try {
    token = jwt.sign(
      { userId: newUser.id, email: newUser.email,role:'user' },
      "cr-hunter&dasunx",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("sigining up faild, token creation error!"+err, 500);
    return next(error);
  }

  res
    .status(201)
    .json({ userId: newUser.id, email: newUser.email, token: token,role:'user' });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let identifiedUser;
  try {
    identifiedUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("something went wrong on db side!");
    return next(error);
  }
  if (!identifiedUser) {
    return next(new HttpError("Email or password is not correct!", 401));
  }
  let isValidPassword;
  try {
    isValidPassword = await bcrypt.compare(password, identifiedUser.password);
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
      { userId: identifiedUser.id, email: identifiedUser.email,role:'user' },
      "cr-hunter&dasunx",
      { expiresIn: "1h" }
    );
  } catch (err) {
      const error =new HttpError('Logging Failed! something went wrong when creating the token',500);
      return next(error);
  }

  res.json({
    userId:identifiedUser.id,email:identifiedUser.email,token:token,role:'user'
  });
};

exports.login = login;
exports.getAllUsers = getAllUsers;
exports.signUp = signUp;
