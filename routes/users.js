import { Router } from 'express';
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from '../controllers/users.js';
import advanceResult from '../middlewares/advanceResult.js';
import { authorize, protect } from '../middlewares/auth.js';
import User from '../models/User.js';

const router = Router();

router.use(protect);
router.use(authorize('admin'));

router.route('/').get(advanceResult(User), getUsers).post(createUser);

router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

export default router;
