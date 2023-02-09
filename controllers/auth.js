import ErrorResponse from '../utils/ErrorResponse.js';
import asyncHandler from '../middlewares/async.js';
import sendEmail from '../utils/sendEmail.js';
import User from '../models/User.js';

/**
 * @desc        Utility fn toget token from model,
 *              create cookie and send response
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
 * @access      Private
 */
export const getMe = asyncHandler(async (req, res, next) =>
  res.status(200).json({ success: true, user: req.user }),
);

/**
 * @desc        Forgot passoword
 * @route       POST /api/v1/auth/forgotpassword
 * @access      Public
 */
export const forgotPassword = asyncHandler(async (req, res, next) => {
  if (!req.body.email) {
    return next(new ErrorResponse('Email is required', 404));
  }

  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse('No user found with that email', 404));
  }

  // get reset token
  const resetToken = await user.getResetPasswordToken();

  // create reset url
  const resetUrl = `${req.protocol}://${req.get(
    'host',
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you have requested the password reset. Please make a PUT request to: \n\n${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token for codecamp.com',
      message,
    });
    return res.status(200).json({ success: true, data: 'Email Sent' });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse('Email could not be sent', 500));
  }
});
