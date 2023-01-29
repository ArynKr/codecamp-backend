import ErrorResponse from '../utils/ErrorResponse.js';

/* eslint-disable no-console */
const errorHandler = (err, _req, res, _next) => {
  let error = { ...err };
  error.message = err.message;

  // log to console for dev
  console.log('\n*****************\n'.blue, err, '\n******************\n'.blue);

  // mongoose bad object
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${error.value}`;
    error = new ErrorResponse(message, 404);
  }

  // mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 400);
  }

  // mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  res
    .status(error.statusCode || 500)
    .json({ success: false, error: error.message || 'Server Error' });
};

export default errorHandler;
