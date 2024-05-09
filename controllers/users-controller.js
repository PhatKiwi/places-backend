function getPlaceById(req, res, next) {
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

function getPlaceByCreatorId(req, res, next) {
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
