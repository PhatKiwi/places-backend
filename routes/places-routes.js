import express from "express";

import {
  getPlaceByCreatorId,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
} from "../controllers/places-controller.js";

const router = express.Router();

router.get("/:pid", getPlaceById);

router.get("/user/:uid", getPlaceByCreatorId);

router.post("/", createPlace);

router.patch("/:pid", updatePlace);

router.delete("/:pid", deletePlace);

export default router;
