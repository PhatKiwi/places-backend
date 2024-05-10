import express from "express";
import bodyParser from "body-parser";
import "dotenv/config";
import mongoose from "mongoose";

import HttpError from "./models/http-error.js";
import placesRoutes from "./routes/places-routes.js";
import usersRoutes from "./routes/users-routes.js";

const app = express();

const MONGODB_USERNAME = process.env.MONGODB_USERNAME;
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
const uri = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@cluster0.g3viuar.mongodb.net/places?retryWrites=true&w=majority&appName=Cluster0`;

app.use(bodyParser.json());

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || `An unkown error occurred` });
});

mongoose
  .connect(uri)
  .then(() => {
    app.listen(5001);
  })
  .catch((err) => {
    console.log(err);
  });
