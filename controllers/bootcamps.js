import path from 'path';
import asyncHandler from '../middlewares/async.js';
import Bootcamp from '../models/Bootcamp.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import geocoder from '../utils/geocoder.js';

/**
 * @desc        get all bootcamps
 * @route       GET /api/v1/bootcamps
 * @access      Public
 */
export const getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(201).json(res.advanceResult);
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
  // add user who creates bootcamp to req body
  req.body.user = req.user.id;

  // check for published bootcamp
  const published = await Bootcamp.findOne({ user: req.user._id });

  // if user is not an admin and already published a bootcamp
  if (published && req.user.role !== 'admin') {
    return next(
      new ErrorResponse('You have already published a bootcamp', 400),
    );
  }

  const bootcamp = new Bootcamp(req.body);
  const result = await bootcamp.save();
  return res.status(201).json({
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
  let bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404),
    );
  }

  // making sure user is the owner of bootcamp
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse('You are not authorized to update this bootcamp', 400),
    );
  }

  bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
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
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404),
    );
  }

  // making sure user is the owner of bootcamp
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse('You are not authorized to delete this bootcamp', 400),
    );
  }

  await bootcamp.remove();
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

/**
 * @desc        upload photo for bootcamp
 * @route       PUT /api/v1/bootcamps/:id/photo
 * @access      Private
 */
export const bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404),
    );
  }

  // making sure user is the owner of bootcamp
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse('You are not authorized to update this bootcamp', 400),
    );
  }

  if (!req.files) {
    return next(new ErrorResponse('Please upload a file', 400));
  }
  const { photo } = req.files;

  // make sure photo uploaded is of type image
  if (!photo.mimetype.startsWith('image')) {
    return next(new ErrorResponse('Please upload image file type', 400));
  }

  // check file size
  if (photo.size > process.env.FILE_UPLOAD_LIMIT) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${
          process.env.FILE_UPLOAD_LIMIT / (1024 * 1024)
        } MegaBytes`,
        400,
      ),
    );
  }

  // create a custom filename
  photo.name = `bootcamp_main_${bootcamp._id}${path.parse(photo.name).ext}`;

  // move file
  // eslint-disable-next-line consistent-return
  photo.mv(`${process.env.FILE_UPLOAD_PATH}/${photo.name}`, async (err) => {
    if (err) {
      return next(new ErrorResponse('Problem with file upload', 500));
    }
    await Bootcamp.findByIdAndUpdate(bootcamp._id, { photo: photo.name });
  });

  return res.status(200).json({ success: true, data: photo.name });
});
