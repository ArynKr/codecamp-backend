import ErrorResponse from '../utils/ErrorResponse.js';
import asyncHandler from '../middlewares/async.js';
import User from '../models/User.js';

/**
 * @desc        Get all users
 * @route       GET /api/v1/auth/users
 * @access      Admin
 */
export const getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advanceResult);
});

/**
 * @desc        Get a single user
 * @route       GET /api/v1/auth/users/:id
 * @access      Admin
 */
export const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorResponse(`No user with id: ${req.params.id} found`, 404));
  }
  return res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * @desc        Create a user
 * @route       POST /api/v1/auth/users
 * @access      Admin
 */
export const createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  return res.status(201).json({
    success: true,
    data: user,
  });
});

/**
 * @desc        Update a user
 * @route       PUT /api/v1/auth/users/:id
 * @access      Admin
 */
export const updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  return res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * @desc        Delete a single user
 * @route       DELETE /api/v1/auth/users/:id
 * @access      Admin
 */
export const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new ErrorResponse(`No user with id: ${req.params.id} found`, 404));
  }
  return res.status(200).json({
    success: true,
    data: user,
  });
});
