import { v4 as uuidv4 } from "uuid";
import { validationResult } from "express-validator";

import HttpError from "../models/http-error.js";
import getCoordsForAddress from "../util/location.js";
import Place from "../models/place.js";

export async function getPlaceById(req, res, next) {
  const placeId = req.params.pid;
  let place;

  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }

  if (!place) {
    const error = new HttpError(
      `Could not find a place with the id ${placeId}`,
      404
    );
    return next(error);
  }

  res.json({ place: place.toObject({ getters: true }) });
}

export async function getPlacesByCreatorId(req, res, next) {
  const userId = req.params.uid;
  let places;

  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }

  if (!places || places.length === 0) {
    const error = new HttpError(
      `Could not find a places with the id ${userId}`,
      404
    );
    return next(error);
  }

  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
}

export async function createPlace(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError("invalid data", 422));
  }

  const { title, description, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: "a url that points to an image",
    creator,
  });

  try {
    await createdPlace.save();
  } catch (err) {
    const error = new HttpError("Creating place failed", 500);
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
}

export async function updatePlace(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError("invalid data", 422));
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  try {
    const updatedPlace = await Place.findByIdAndUpdate(
      placeId,
      {
        title,
        description,
      },
      { runValidators: true, new: true }
    );
    if (!updatedPlace) {
      return next(new HttpError("Could not find place to update"), 500);
    }

    res.json({ place: updatedPlace.toObject({ getters: true }) });
  } catch (err) {
    return next(new HttpError("Something went wrong", 500));
  }
}

export async function deletePlace(req, res, next) {
  const placeId = req.params.pid;
  try {
    const deletedPlace = await Place.findByIdAndDelete(placeId);
    if (!deletedPlace) {
      return next(new HttpError("Could not find place to delete"), 500);
    }
    res.json({ message: "Place Deleted" });
  } catch (err) {
    return next(new HttpError("Something went wrong", 500));
  }
}
