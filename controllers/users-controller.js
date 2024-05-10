import { v4 as uuidv4 } from "uuid";
import { validationResult } from "express-validator";

import HttpError from "../models/http-error.js";
import User from "../models/user.js";

export async function getUsers(req, res, next) {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    return next(new HttpError("something went wrong"), 500);
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
}

export async function signup(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError("invalid data", 422));
  }

  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return next(new HttpError("email already in use please login", 422));
    }
  } catch (err) {
    return next(new HttpError("something went wrong", 500));
  }

  const createdUser = new User({
    name,
    email,
    image: "This is a link to a file",
    password, // Will encrypt later
    places: "Dummy value will be a list of places",
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Creating user failed", 500);
    return next(error);
  }
  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
}

export async function login(req, res, next) {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email: email });
    if (!existingUser || existingUser.password !== password) {
      // implement actual logging in
      return next(new HttpError("Login failed invalid username or password"));
    }
  } catch (err) {
    return next(new HttpError("something went wrong", 500));
  }

  res.json({ message: "logged in" });
}
