import { validationResult } from "express-validator";

import HttpError from "../models/http-error.js";
import getCoordsForAddress from "../util/location.js";
import Place from "../models/place.js";
import User from "../models/user.js";
import mongoose from "mongoose";

export async function getPlaceById(req, res, next) {
  const { pid } = req.params;
  let place;

  try {
    place = await Place.findById(pid);
  } catch (err) {
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }

  if (!place) {
    const error = new HttpError(
      `Could not find a place with the id ${pid}`,
      404
    );
    return next(error);
  }

  res.json({ place: place.toObject({ getters: true }) });
}

export async function getPlacesByCreatorId(req, res, next) {
  const { uid } = req.params;
  let userWithPlaces;

  try {
    userWithPlaces = await User.findById(uid).populate("places");
  } catch (err) {
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }

  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    const error = new HttpError(
      `Could not find a places with the id ${uid}`,
      404
    );
    return next(error);
  }

  res.json({
    places: userWithPlaces.places.map((place) =>
      place.toObject({ getters: true })
    ),
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

  let user;
  try {
    user = await User.findById(creator);
    if (!user) {
      return next(new HttpError("could not find user by id", 500));
    }
  } catch (err) {
    return next(new HttpError("Creating place failed", 500));
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await createdPlace.save({ session });
    user.places.push(createdPlace);
    await user.save({ session });
    await session.commitTransaction();
  } catch (err) {
    return next(new HttpError("Creating place failed", 500));
  }

  res.status(201).json({ place: createdPlace });
}

export async function updatePlace(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError("invalid data", 422));
  }

  const { title, description } = req.body;
  const { pid } = req.params;

  try {
    const updatedPlace = await Place.findByIdAndUpdate(
      pid,
      {
        title,
        description,
      },
      { runValidators: true, new: true }
    );
    if (!updatedPlace) {
      return next(new HttpError("Could not find place to update", 500));
    }

    res.json({ place: updatedPlace.toObject({ getters: true }) });
  } catch (err) {
    next(new HttpError("Something went wrong", 500));
  }
}

export async function deletePlace(req, res, next) {
  try {
    const { pid } = req.params;

    const session = await mongoose.startSession();
    session.startTransaction();

    const place = await Place.findById(pid);
    if (!place) return next(new HttpError("Place not found", 404));

    const updatedUserPlaces = await User.updateOne(
      { _id: place.creator },
      { $pull: { places: pid } },
      { session }
    );
    if (updatedUserPlaces.modifiedCount === 0) {
      return next(
        new HttpError("Failed to remove place from user's places", 500)
      );
    }

    const deletedPlace = await Place.findByIdAndDelete(pid).session(session);
    if (!deletedPlace)
      return next(new HttpError("Failed to delete the place", 500));

    await session.commitTransaction();

    res.status(200).json({ message: "Place deleted!" });
  } catch (error) {
    console.error(">>> deletePlace", error);
    next(error);
  }
}
