import asyncHandler from 'express-async-handler';
import Quiz from '../models/quizModel.js';
import User from '../models/userModel.js';

/**
 * @desc get public quizzes
 * @route GET /api/quizzes
 * @access public
 */
const getQuizzes = asyncHandler(async (req, res) => {
  const quizzes = await Quiz.find({ isPublic: true }).select('_id');

  const flattenedQuizzes = quizzes.map((quiz) => quiz._id);
  res.json(flattenedQuizzes);
});

/**
 * @desc get quiz details
 * @route GET /api/quizzes/:id
 * @access public
 */
const getQuiz = asyncHandler(async (req, res) => {
  if (!req.params.id) {
    res.status(400);
    throw new Error('Quiz ID could not be found in request parameters');
  }

  const quiz = await Quiz.findById(req.params.id);

  if (!quiz) {
    res.status(404);
    throw new Error('Quiz not found');
  }

  res.json(quiz);
});

/**
 * @desc add quiz
 * @route POST /api/quizzes
 * @access private
 */
const addQuiz = asyncHandler(async (req, res) => {
  const { title, description, tags, isPublic, questions } = req.body;

  const quiz = await Quiz.create({
    creator: req.user._id,
    title,
    description,
    tags,
    isPublic,
    questions,
  });

  if (!quiz) {
    res.status(400);
    throw new Error('Could not create quiz');
  }

  const user = await User.findByIdAndUpdate(req.user._id, {
    $push: { quizzes: quiz._id },
  });

  if (!user) {
    res.status(400);
    throw new Error('Could not update user');
  }

  res.json({
    message: 'Quiz created',
  });
});

/**
 * @desc delete quiz
 * @route DELETE /api/quizzes/:id
 * @access private
 */
const removeQuiz = asyncHandler(async (req, res) => {
  if (!req.params.id) {
    res.status(400);
    throw new Error('Quiz ID could not be found in request parameters');
  }

  const quiz = Quiz.findById(req.params.id);

  if (!quiz) {
    res.status(404);
    throw new Error('Quiz not found');
  }

  if (quiz.creator !== req.user._id) {
    res.status(401);
    throw new Error('User not authorized to delete this quiz');
  }

  await quiz.remove();

  const user = await User.findByIdAndUpdate(req.user._id, {
    $pull: { quizzes: req.params.id },
  });

  if (!user) {
    res.status(400);
    throw new Error('Could not update user');
  }

  res.json({
    message: 'Quiz deleted',
  });
});

/**
 * @desc update quiz
 * @route PUT /api/quizzes/:id
 * @access private
 */
const updateQuiz = asyncHandler(async (req, res) => {
  if (!req.params.id) {
    res.status(400);
    throw new Error('Quiz ID could not be found in request parameters');
  }

  const { title, description, tags, isPublic, questions } = req.body;

  const quiz = await Quiz.findById(req.params.id);

  if (!quiz) {
    res.status(404);
    throw new Error('Quiz not found');
  }

  if (quiz.creator !== req.user._id) {
    res.status(401);
    throw new Error('User not authorized to edit this quiz');
  }

  let publicationChange = false;

  quiz.title = title || quiz.title;
  quiz.description = description || quiz.description;
  quiz.tags = tags || quiz.tags;
  quiz.questions = questions || quiz.questions;

  if (isPublic !== undefined && isPublic !== quiz.isPublic) {
    quiz.isPublic = isPublic;
    publicationChange = true;
  }

  await quiz.save();

  res.json({
    publicationChange,
    message: 'Quiz updated',
  });
});

export { getQuizzes, getQuiz, addQuiz, removeQuiz, updateQuiz };
