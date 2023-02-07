import ErrorResponse from '../utils/ErrorResponse.js';
import asyncHandler from '../middlewares/async.js';
import User from '../models/User.js';

/**
 * @desc        Utility fn toget token from model, create cookie and send response
 */
const sendTokenResponse = (user, statusCode, res) => {
  // create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
  });
};

/**
 * @desc        Register a user
 * @route       POST /api/v1/auth/register
 * @access      Public
 */
export const register = asyncHandler(async (req, res, next) => {
  // eslint-disable-next-line object-curly-newline
  const { name, email, password, role } = req.body;

  // create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  return sendTokenResponse(user, 200, res);
});

/**
 * @desc        Login a user
 * @route       POST /api/v1/auth/login
 * @access      Public
 */
// eslint-disable-next-line import/prefer-default-export
export const login = asyncHandler(async (req, res, next) => {
  // eslint-disable-next-line object-curly-newline
  const { email, password } = req.body;

  // validate email and password
  if (!email || !password) {
    return next(
      new ErrorResponse('Please provide an email and a password', 404),
    );
  }

  // check for user
  const user = await User.findOne({ email }).select('+password');

  // make sure this error and password not matches error is same
  // so that an attacker cannot know about registered emails
  // so creating a variable to prevent any typo
  const invalidResponse = 'Invalid Credentials';
  if (!user) {
    return next(new ErrorResponse(invalidResponse, 404));
  }

  // check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse(invalidResponse, 404));
  }

  return sendTokenResponse(user, 200, res);
});

/**
 * @desc        Register a user
 * @route       POST /api/v1/auth/register
 * @access      Public
 */
export const getMe = asyncHandler(async (req, res, next) =>
  res.status(200).json({ success: true, user: req.user }),
);
