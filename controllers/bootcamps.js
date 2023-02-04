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
  // copy req.query for modifications
  const reqQuery = { ...req.query };

  // convert $in values to an array
  for (let key in reqQuery) {
    if (reqQuery[key].in) reqQuery[key].in = reqQuery[key].in.split(',');
  }

  // remove fields
  const removeFields = ['select', 'sort', 'page', 'limit'];
  removeFields.forEach((field) => delete reqQuery[field]);

  // create operators ($gt, $gte, etc)
  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/, (match) => `$${match}`);
  console.log(JSON.parse(queryStr));

  // parse the queryStr
  let query = Bootcamp.find(JSON.parse(queryStr));

  // select field value extraction
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIdx = (page - 1) * limit;
  const endIdx = page * limit;
  const total = await Bootcamp.countDocuments();
  query = query.skip(startIdx).limit(limit);

  // executing query
  const bootcamps = await query;

  // pagination result
  const pagination = {};
  if (endIdx < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIdx > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(201).json({
    success: true,
    count: bootcamps.length,
    pagination,
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
