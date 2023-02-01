import asyncHandler from '../middlewares/async.js';
import Bootcamp from '../models/Bootcamp.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import geocoder from '../utils/geocoder.js';

/**
 * @desc        get all bootcamps
 * @route       GET /api/v1/bootcamps
 * @access      Public
 */
export const getBootcamps = asyncHandler(async (_req, res, next) => {
  const bootcamps = await Bootcamp.find();
  res.status(201).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

/**
 * @desc        get single bootcamps
 * @route       GET /api/v1/bootcamps/:id
 * @access      Public
 */
export const getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404),
    );
  }
  return res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

/**
 * @desc        create new bootcamp
 * @route       POST /api/v1/bootcamps
 * @access      Private
 */
export const createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = new Bootcamp(req.body);
  const result = await bootcamp.save();
  res.status(201).json({
    success: true,
    data: result,
  });
});

/**
 * @desc        Update a bootcamp
 * @route       PUT /api/v1/bootcamps/:id
 * @access      Private
 */
export const updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404),
    );
  }
  return res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

/**
 * @desc        delete a bootcamp
 * @route       DELETE /api/v1/bootcamps/:id
 * @access      Private
 */
export const deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404),
    );
  }
  return res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

/**
 * @desc        get bootcamps within a radius
 * @route       GET /api/v1/bootcamps/search
 * @access      Private
 */
export const searchBootcamps = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.query;

  // get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // convert radius distance to radians
  // dividing by earth's radius 6,378 km or 3,963.2 miles
  const radius = distance / 6378;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});
