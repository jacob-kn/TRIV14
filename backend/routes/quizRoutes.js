import express from 'express';

import {
  getQuizzes,
  getQuiz,
  addQuiz,
  removeQuiz,
  updateQuiz,
} from '../controllers/quizController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getQuizzes).post(protect, addQuiz);

router
  .route('/:id')
  .get(getQuiz)
  .delete(protect, removeQuiz)
  .put(protect, updateQuiz);

export default router;
