import asyncHandler from 'express-async-handler';
import Quiz from '../models/quizModel.js';

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

  await Quiz.findByIdAndDelete(req.params.id);

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

  let publicationChange = false;
  if (quiz) {
    quiz.title = title || quiz.title;
    quiz.description = description || quiz.description;
    quiz.tags = tags || quiz.tags;
    quiz.questions = questions || quiz.questions;

    let publicationChange = false;
    if (isPublic !== undefined && isPublic !== quiz.isPublic) {
      quiz.isPublic = isPublic;
      publicationChange = true;
    }

    await quiz.save();
  }

  res.json({
    publicationChange,
    message: 'Quiz updated',
  });
});

export { getQuizzes, getQuiz, addQuiz, removeQuiz, updateQuiz };
