import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Quiz from '../models/quizModel.js';
import generateToken from '../utils/generateToken.js';

/**
 * @desc register a new user
 * @route POST /api/users/user
 * @access public
 */
const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    res.status(400); //400 Bad Request
    throw new Error('Please fill in all fields');
  }

  // check to see if email already exists in the user database
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    email,
    username,
    password,
  });

  if (user) {
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      email: user.email,
      username: user.username,
    });
  } else {
    res.status(400);
    throw new Error('Could not create user - Invalid entry');
  }
});

/**
 * @desc login/authenticate a user
 * @route POST /api/users/login
 * @access public
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400); //400 Bad Request
    throw new Error('Please fill in all fields');
  }

  const user = await User.findOne({ email }); // find by email

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    res.status(200).json({
      _id: user._id,
      email: user.email,
      username: user.username,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

/**
 * @desc logout user / clear cookie
 * @route POST /api/users/logout
 * @access public
 */
const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

/**
 * @desc get user profile
 * @route GET /api/users/profile
 * @access private
 */
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json({
      _id: user._id,
      email: user.email,
      username: user.username,
      avatar: user.avatar,
      quizzesTaken: user.quizzesTaken,
      highScore: user.highScore,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * @desc delete the current user
 * @route DELETE /api/users
 * @access private
 */
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.user._id);

  if (user) {
    // Delete all quizzes made by the user
    await Quiz.deleteMany({ creator: req.user._id });

    res.status(200).json({
      message: 'User and associated quizzes deleted',
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * @desc update user profile
 * @route PUT /api/users/profile
 * @access private
 */
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (req.body.email) {
    // check to see if email already exists in the user database
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) {
      res.status(400);
      throw new Error('A user with that email already exists');
    }
  }

  if (user) {
    user.email = req.body.email || user.email;
    user.username = req.body.username || user.username;
    user.avatar = req.body.avatar || user.avatar;
    user.quizzesTaken = req.body.quizzesTaken || user.quizzesTaken;

    if (req.body.password) {
      user.password = req.body.password;
    }

    if (req.body.highScore && req.body.highScore > user.highScore) {
      user.highScore = req.body.highScore;
    }

    await user.save();

    res.json({
      message: 'User Profile updated',
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * @desc get user's quizzes
 * @route GET /api/users/quizzes?page
 * @access private
 */
const getUserQuizzes = asyncHandler(async (req, res) => {
  const page = req.query.page || 1;

  if (page < 1) {
    res.status(400);
    throw new Error('Page number must be greater than 0');
  }

  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(400);
    throw new Error('User not found');
  }

  const pageSize = 12;
  const startIndex = (page - 1) * pageSize;

  const count = user.quizzes.length;
  if (count !== 0 && startIndex >= count) {
    res.status(400);
    throw new Error(`Page number exceeds number of quizzes`);
  }

  const quizzes = user.quizzes.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(count / pageSize);
  res.status(200).json({ quizzes, totalPages });
});

export {
  registerUser,
  loginUser,
  logoutUser,
  deleteUser,
  getUserProfile,
  updateUserProfile,
  getUserQuizzes,
};
