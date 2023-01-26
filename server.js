import express from 'express';
import { config } from 'dotenv';

/* Load Environment Variables */
config({ path: './config/config.env' });

const app = express();

app.get('/', (req, res) => res.send('Hello'));
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
