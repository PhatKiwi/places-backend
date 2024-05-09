import HttpError from "../models/http-error.js";
import { v4 as uuidv4 } from "uuid";

let DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the buildings in the world",
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    address: "20 W 34th St, New York, NY 10001",
    creator: "u1",
  },
];

export function getPlaceById(req, res, next) {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  });

  if (!place) {
    const error = new HttpError(
      `Could not find a place with the id ${placeId}`,
      404
    );
    return next(error);
  }

  res.json({ place });
}

export function getPlaceByCreatorId(req, res, next) {
  const userId = req.params.uid;
  const place = DUMMY_PLACES.find((p) => {
    return p.creator === userId;
  });

  if (!place) {
    const error = new HttpError(
      `Could not find a place with the id ${userId}`,
      404
    );
    return next(error);
  }

  res.json({ place });
}

export function createPlace(req, res, next) {
  const { title, description, coordinates, address, creator } = req.body;
  const createdPlace = {
    id: uuidv4(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };

  DUMMY_PLACES.push(createdPlace);

  res.status(201).json({ place: createdPlace });
}

export function updatePlace(req, res, next) {
  const { title, description } = req.body;
  const placeId = req.params.pid;
  const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);
  const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) };
  updatedPlace.title = title;
  updatedPlace.description = description;

  if (!updatedPlace) {
    const error = new HttpError(
      `Could not find a place with the id ${placeId}`,
      404
    );
    return next(error);
  }

  DUMMY_PLACES[placeIndex] = updatedPlace;

  res.json({ place: updatedPlace });
}

export function deletePlace(req, res, next) {
  const placeId = req.params.pid;
  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);
  res.json({ message: "Deleted place" });
}
