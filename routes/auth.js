import express from 'express';
import { protect } from '../middlewares/auth.js';
import {
  forgotPassword,
  getMe,
  login,
  register,
  resetPassword,
  updateDetails,
  updatePassword,
} from '../controllers/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resetToken', resetPassword);

export default router;
