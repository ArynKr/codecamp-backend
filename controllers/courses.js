import ErrorResponse from '../utils/ErrorResponse.js';
import asyncHandler from '../middlewares/async.js';
import Course from '../models/Course.js';
import Bootcamp from '../models/Bootcamp.js';

/**
 * @desc        get all courses
 * @route       GET /api/v1/courses
 * @route       GET /api/v1/bootcamps/:bootcampId/courses
 * @access      Public
 */
export const getCourses = asyncHandler(async (req, res, next) => {
  const { bootcampId } = req.params;
  if (bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });

    res.status(200).json({
      status: true,
      length: courses.length,
      data: courses,
    });
  } else {
    res.status(200).json(res.advanceResult);
  }
});

/**
 * @desc        get single course
 * @route       GET /api/v1/courses/:id
 * @access      Public
 */
export const getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });
  if (!course) {
    return next(
      new ErrorResponse(`No course with id of ${req.params.id}`, 404),
    );
  }
  return res.status(200).json({ success: true, data: course });
});

/**
 * @desc        Add a course
 * @route       POST /api/v1/bootcamps/:bootcampId/courses
 * @access      Private
 */
export const addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `No bootcamp found with id of ${req.params.bootcampId}`,
        404,
      ),
    );
  }

  const course = await Course.create(req.body);

  return res.status(200).json({
    success: true,
    data: course,
  });
});

/**
 * @desc        Update a course
 * @route       PUT /api/v1/courses/:id
 * @access      Private
 */
export const updateCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!course) {
    return next(
      new ErrorResponse(`No course found with id of ${req.params.id}`, 404),
    );
  }
  return res.status(201).json({
    success: true,
    data: course,
  });
});

/**
 * @desc        Delete a course
 * @route       DELETE /api/v1/courses/:id
 * @access      Private
 */
export const deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findByIdAndDelete(req.params.id, req.body);
  if (!course) {
    return next(
      new ErrorResponse(`No course found with id of ${req.params.id}`, 404),
    );
  }
  return res.status(201).json({
    success: true,
    data: course,
  });
});
