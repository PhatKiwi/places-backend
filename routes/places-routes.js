import express from "express";

import {
  getPlaceByCreatorId,
  getPlaceById,
  createPlace,
} from "../controllers/places-controller.js";

const router = express.Router();

router.get("/:pid", getPlaceById);

router.get("/user/:uid", getPlaceByCreatorId);

router.post("/", createPlace);

export default router;
