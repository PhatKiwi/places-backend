import { v4 as uuidv4 } from "uuid";
import { validationResult } from "express-validator";

import HttpError from "../models/http-error.js";
import User from "../models/user.js";

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Phat Kiwi",
    email: "test@test",
    password: "test",
  },
];

export function getUsers(req, res, next) {
  res.json({ users: DUMMY_USERS });
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

export function login(req, res, next) {
  const { email, password } = req.body;

  const user = DUMMY_USERS.find((u) => u.email === email);
  if (!user || user.password !== password) {
    return next(new HttpError("incorrect user email or password", 401));
  }
  res.json({ message: "logged in" });
}
