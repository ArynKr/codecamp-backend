import express from 'express';
import { config } from 'dotenv';
import morgan from 'morgan';
import bootcamps from './routes/bootcamps.js';

/* load environment variables */
config({ path: './config/config.env' });

const app = express();
const PORT = process.env.PORT || 5000;

/* middlewares */
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.get('/health-check', (req, res) => res.status(200).send('Working'));
app.use('/api/v1/bootcamps', bootcamps);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
