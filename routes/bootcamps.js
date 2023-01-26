import { Router } from 'express';
import {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
} from '../controllers/bootcamps.js';

const router = Router();

router.route('/').get(getBootcamps).post(createBootcamp);

router
  .route('/:id')
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

export default router;
