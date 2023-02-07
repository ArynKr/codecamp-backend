import { Router } from 'express';
import Course from '../models/Course.js';
import {
  addCourse,
  getCourse,
  getCourses,
  updateCourse,
  deleteCourse,
} from '../controllers/courses.js';
import advanceResult from '../middlewares/advanceResult.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = Router({ mergeParams: true });

router
  .route('/')
  .get(
    advanceResult(Course, {
      path: 'bootcamp',
      select: 'name description',
    }),
    getCourses,
  )
  .post(protect, authorize('publisher', 'admin'), addCourse);
router
  .route('/:id')
  .get(getCourse)
  .put(protect, authorize('publisher', 'admin'), updateCourse)
  .delete(protect, authorize('publisher', 'admin'), deleteCourse);

export default router;
