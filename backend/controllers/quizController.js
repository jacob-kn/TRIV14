import asyncHandler from 'express-async-handler';
import Quiz from '../models/quizModel.js';
import User from '../models/userModel.js';

/**
 * @desc get public quizzes
 * @route GET /api/quizzes?page&sort&filter
 * @access public
 */
const getQuizzes = asyncHandler(async (req, res) => {
  const page = req.query.page !== undefined ? req.query.page : 1;
  const sort = req.query.sort || '-createdAt';
  const filter = req.query.filter || '';

  if (page < 1) {
    res.status(400);
    throw new Error('Page number must be greater than 0');
  }

  if (!['-createdAt', 'createdAt', '-plays', 'plays'].includes(sort)) {
    res.status(400);
    throw new Error('Invalid sort parameter');
  }

  const tags = [
    'Math',
    'Science',
    'History',
    'Geography',
    'Literature',
    'Pop Culture',
    'Other',
  ];
  const filters = filter.split(',').filter(Boolean); // Remove empty strings from filters array

  if (filter && !filters.every((filter) => tags.includes(filter))) {
    res.status(400);
    throw new Error('Invalid filter parameter');
  }

  const pageSize = 12;
  const startIndex = (page - 1) * pageSize;

  const query = { isPublic: true };
  if (filters.length > 0) {
    query.tags = { $in: filters };
  }

  const count = await Quiz.countDocuments(query);

  if (count !== 0 && startIndex >= count) {
    res.status(400);
    throw new Error(`Page number exceeds number of quizzes`);
  }

  const quizzes = await Quiz.find(query)
    .sort(sort)
    .skip(startIndex)
    .limit(pageSize);

  if (!quizzes) {
    res.status(404);
    throw new Error('Quizzes not found');
  }

  const flattenedQuizzes = quizzes.map((quiz) => quiz._id);
  const totalPages = Math.ceil(count / pageSize);
  res.status(200).json({
    quizzes: flattenedQuizzes,
    totalPages,
  });
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

  const quiz = await Quiz.findById(req.params.id);

  if (!quiz) {
    res.status(404);
    throw new Error('Quiz not found');
  }

  if (quiz.creator.toString() !== req.user._id.toString()) {
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

  if (quiz.creator.toString() !== req.user._id.toString()) {
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
