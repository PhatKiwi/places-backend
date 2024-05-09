import express from "express";
import bodyParser from "body-parser";

import placesRoutes from "./routes/places-routes.js";

const app = express();

app.use("/api/places", placesRoutes);

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || `An unkown error occurred` });
});

app.listen(5001);
