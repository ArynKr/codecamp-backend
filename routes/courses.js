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
import protect from '../middlewares/auth.js';

const router = Router({ mergeParams: true });

router.route('/').get(advanceResult(Course, {
  path: 'bootcamp',
  select: 'name description',
}), getCourses).post(protect, addCourse);
router.route('/:id').get(getCourse).put(protect, updateCourse).delete(protect, deleteCourse);

export default router;
