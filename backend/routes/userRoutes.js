import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  deleteUser,
  getUserProfile,
  updateUserProfile,
} from '../controllers/userController.js';
import {
  getQuizzes,
  removeFromQuizzes,
  updateQuiz,
} from '../controllers/userQuizzesController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(registerUser).delete(protect, deleteUser);

router.post('/login', loginUser);
router.post('/logout', logoutUser);
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.get('/quizzes', protect, getQuizzes);
router
  .route('/quizzes/:id')
  .delete(protect, removeFromQuizzes)
  .put(protect, updateQuiz);

export default router;
