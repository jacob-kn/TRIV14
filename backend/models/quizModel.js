import mongoose from 'mongoose';

const quizSchema = mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // reference to a model of User
    },
    title: {
      type: String,
      required: [true, 'Please add a title'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    tags: {
      type: [String],
      required: false,
      default: ['Other'],
    },
    plays: {
      type: Number,
      required: false,
      default: 0,
    },
    isPublic: {
      type: Boolean,
      required: false,
      default: false,
    },
    questions: {
      type: [
        {
          type: {
            type: String,
            required: [true, 'Please add a type'],
          },
          question: {
            type: String,
            required: [true, 'Please add a question'],
          },
          options: [
            {
              text: {
                type: String,
                required: [true, 'Please add an option text'],
              },
              isCorrect: {
                type: Boolean,
                default: false,
              },
            },
          ],
        },
      ],
      required: [true, 'Please add questions'],
    },
  },
  {
    timestamps: true,
  }
);

const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz;
