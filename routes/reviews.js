import { Router } from 'express';
import {
  addReview,
  deleteReview,
  getReview,
  getReviews,
  updateReview,
} from '../controllers/reviews.js';
import advanceResult from '../middlewares/advanceResult.js';
import { authorize, protect } from '../middlewares/auth.js';
import Review from '../models/Review.js';

const router = Router({ mergeParams: true });

router
  .route('/')
  .get(
    advanceResult(Review, {
      path: 'bootcamp',
      select: 'name description',
    }),
    getReviews,
  )
  .post(protect, authorize('user', 'admin'), addReview);

router.route('/:id').get(getReview).put(protect, authorize('user', 'admin'), updateReview).delete(protect, authorize('user', 'admin'), deleteReview);

export default router;
