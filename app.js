import express from "express";
import bodyParser from "body-parser";

import placesRoutes from "./routes/places-routes.js";

const app = express();

app.use("/api/places", placesRoutes);

app.listen(5001);
