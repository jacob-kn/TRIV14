import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, 'Please add an email'],
    },
    username: {
      type: String,
      required: [true, 'Please add a username'],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
    quizzes: [
      {
        // array of created quizzes
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Quiz', // reference to a model of Quiz
      },
    ],
    quizzesTaken: {
      type: Number,
      required: false,
      default: 0,
    },
    highScore: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    // if password is not modified, call next middleware
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;
