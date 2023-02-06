import { Router } from 'express';
import Bootcamp from '../models/Bootcamp.js';
import {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  searchBootcamps,
  bootcampPhotoUpload,
} from '../controllers/bootcamps.js';
import advanceResult from '../middlewares/advanceResult.js';
import protect from '../middlewares/auth.js';

// include other resource routers
import courseRouter from './courses.js';

const router = Router();

// re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);

router.route('/').get(advanceResult(Bootcamp, 'courses'), getBootcamps).post(protect, createBootcamp);
router.route('/search').get(searchBootcamps);
router
  .route('/:id')
  .get(getBootcamp)
  .put(protect, updateBootcamp)
  .delete(protect, deleteBootcamp);

router.route('/:id/photo').put(protect, bootcampPhotoUpload);

export default router;
