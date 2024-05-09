import express from "express";

import {
  getPlacesByCreatorId,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
} from "../controllers/places-controller.js";

const router = express.Router();

router.get("/:pid", getPlaceById);

router.get("/user/:uid", getPlacesByCreatorId);

router.post("/", createPlace);

router.patch("/:pid", updatePlace);

router.delete("/:pid", deletePlace);

export default router;
