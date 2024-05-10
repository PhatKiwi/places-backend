import { v4 as uuidv4 } from "uuid";
import { validationResult } from "express-validator";

import HttpError from "../models/http-error.js";

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

export function signup(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new HttpError("invalid data", 422);
  }

  const { name, email, password } = req.body;

  const hasUser = DUMMY_USERS.find((u) => u.email === email);

  if (hasUser) {
    throw new HttpError("Email already in use", 422);
  }

  const createdUser = {
    id: uuidv4(),
    name,
    email,
    password,
  };

  DUMMY_USERS.push(createdUser);
  res.status(201).json({ user: createdUser });
}

export function login(req, res, next) {
  const { email, password } = req.body;

  const user = DUMMY_USERS.find((u) => u.email === email);
  if (!user || user.password !== password) {
    throw new HttpError("incorrect user email or password", 401);
  }
  res.json({ message: "logged in" });
}
