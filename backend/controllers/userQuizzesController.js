import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Quiz from '../models/quizModel.js';

/**
 * Helper function that gets the user's quizzes and returns the array in a response
 */
const returnQuizzes = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
    .populate({
      path: 'quizzes',
      select: '_id title description tags plays isPublic',
    })
    .exec();

  if (!user) {
    res.status(400);
    throw new Error('User not found');
  }

  if (!user.populated('quizzes')) {
    res.status(400);
    throw new Error('Could not populate created quizzes');
  }
  res.status(200).json(user.quizzes);
});

/**
 * @desc get user's quizzes
 * @route GET /api/users/quizzes
 * @access private
 */
const getQuizzes = asyncHandler(async (req, res) => {
  returnQuizzes(req, res);
});

/**
 * @desc remove from quizzes
 * @route DELETE /api/users/quizzes/:id
 * @access private
 */
const removeFromQuizzes = asyncHandler(async (req, res) => {
  if (!req.params.id) {
    res.status(400);
    throw new Error('Quiz ID could not be found in request parameters');
  }

  await Quiz.findByIdAndDelete(req.params.id);

  returnQuizzes(req, res);
});

/**
 * @desc update quizzes
 * @route PUT /api/users/quizzes/:id
 * @access private
 */
const updateQuiz = asyncHandler(async (req, res) => {
  if (!req.params.id) {
    res.status(400);
    throw new Error('Quiz ID could not be found in request parameters');
  }

  const { title, description, tags, isPublic, questions } = req.body;

  const updateQuiz = {
    title,
    description,
    tags,
    isPublic,
    questions,
  };

  await Quiz.findByIdAndUpdate(req.params.id, updateQuiz);

  returnQuizzes(req, res);
});

export { getQuizzes, removeFromQuizzes, updateQuiz };
