import express from 'express';
import { protect } from '../middlewares/auth.js';
import { getMe, login, register } from '../controllers/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

export default router;
