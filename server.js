import express from 'express';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import cors from 'cors';
import 'colors';
import connectDB from './config/db.js';
import errorHandler from './middlewares/error.js';
import bootcamps from './routes/bootcamps.js';
import courses from './routes/courses.js';
import auth from './routes/auth.js';
import users from './routes/users.js';
import reviews from './routes/reviews.js';

/* load environment variables */
config({ path: './config/config.env' });

/* connect to db */
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// eslint-disable-next-line no-underscore-dangle
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(__filename);

/* set static folder */
app.use(express.static(path.join(__dirname, 'public')));

/* middleware dev requests logging */
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

/* middleware json parser */
app.use(express.json());

/* middleware cookie-parser */
app.use(cookieParser());

/* middleware (file-upload) */
app.use(fileUpload());

/* middleware (sanitize req data) */
app.use(mongoSanitize());

/* middleware (set security headers) */
app.use(helmet());

/* middleware (prevent XSS attacks) */
app.use(xss());

/* middleware enable CORS for api access */
app.use(cors());

/* middleware (rate limit) */
// 100 req per 10 minutes
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
});
app.use(limiter);

/* prevent http param pollution */
app.use(hpp());

/* routes */
app.get('/health-check', (_req, res) => res.status(200).send('Working'));
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

/* middleware (error) */
app.use(errorHandler);

/* main server */
const server = app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
});

/* handled unhandled rejection/error */
process.on('unhandledRejection', (err) => {
  // eslint-disable-next-line no-console
  console.log(`Error: ${err.message}\n‼️closing the server‼️`.red);

  // closing server and exit process
  server.close(() => process.exit(1));
});
