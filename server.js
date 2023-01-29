import express from 'express';
import { config } from 'dotenv';
import morgan from 'morgan';
import 'colors';
import connectDB from './config/db.js';
import errorHandler from './middlewares/error.js';
import bootcamps from './routes/bootcamps.js';

/* load environment variables */
config({ path: './config/config.env' });

/* connect to db */
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

/* middlewares */
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());

/* routes */
app.get('/health-check', (_req, res) => res.status(200).send('Working'));
app.use('/api/v1/bootcamps', bootcamps);

/* middlewares (error) */
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
