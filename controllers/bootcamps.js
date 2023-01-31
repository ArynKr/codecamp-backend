import asyncHandler from '../middlewares/async.js';
import Bootcamp from '../models/Bootcamp.js';
import ErrorResponse from '../utils/ErrorResponse.js';

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
