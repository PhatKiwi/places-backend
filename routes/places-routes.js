import express from "express";

import {
  getPlaceByCreatorId,
  getPlaceById,
} from "../controllers/places-controller.js";

const router = express.Router();

router.get("/:pid", getPlaceById);

router.get("/user/:uid", getPlaceByCreatorId);

export default router;
