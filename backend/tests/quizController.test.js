import { expect } from 'chai';
import sinon from 'sinon';
import Quiz from '../models/quizModel.js';
import User from '../models/userModel.js';
import {
  getQuizzes,
  getQuiz,
  addQuiz,
  removeQuiz,
  updateQuiz,
} from '../controllers/quizController.js';

describe('Quiz Controller', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('GET /api/quizzes', () => {
    it('should get quizzes with default parameters', async () => {
      const req = {
        query: {},
      };

      const res = {
        status: function (status) {
          this.status = status;
          return this;
        },
        json: function (body) {
          this.body = body;
          return this;
        },
      };

      const countStub = sinon.stub(Quiz, 'countDocuments').resolves(10);
      const findStub = sinon.stub(Quiz, 'find').returnsThis();

      const sortStub = sinon.stub().returnsThis();
      const skipStub = sinon.stub().returnsThis();
      const limitStub = sinon
        .stub()
        .resolves([{ _id: 'quiz1' }, { _id: 'quiz2' }]);

      const quizzes = {
        sort: sortStub,
        skip: skipStub,
        limit: limitStub,
      };

      findStub.returns(quizzes);

      await getQuizzes(req, res);

      sinon.assert.calledWith(Quiz.countDocuments, { isPublic: true });
      sinon.assert.calledWith(Quiz.find, { isPublic: true });
      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal({
        quizzes: ['quiz1', 'quiz2'],
        totalPages: 1,
      });
    });

    it('should get quizzes with custom parameters', async () => {
      const req = {
        query: {
          page: 2,
          sort: 'plays',
          filter: 'Math,Science',
        },
      };

      const res = {
        status: function (status) {
          this.status = status;
          return this;
        },
        json: function (body) {
          this.body = body;
          return this;
        },
      };

      const countStub = sinon.stub(Quiz, 'countDocuments').resolves(20);
      const findStub = sinon.stub(Quiz, 'find').returnsThis();

      const sortStub = sinon.stub().returnsThis();
      const skipStub = sinon.stub().returnsThis();
      const limitStub = sinon
        .stub()
        .resolves([{ _id: 'quiz3' }, { _id: 'quiz4' }]);

      const quizzes = {
        sort: sortStub,
        skip: skipStub,
        limit: limitStub,
      };

      findStub.returns(quizzes);

      await getQuizzes(req, res);

      sinon.assert.calledWith(Quiz.countDocuments, {
        isPublic: true,
        tags: { $in: ['Math', 'Science'] },
      });
      sinon.assert.calledWith(Quiz.find, {
        isPublic: true,
        tags: { $in: ['Math', 'Science'] },
      });
      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal({
        quizzes: ['quiz3', 'quiz4'],
        totalPages: 2,
      });
    });

    it('should throw an error if page number is less than 1', async () => {
      const req = {
        query: {
          page: 0,
        },
      };

      const res = {
        status: function (status) {
          this.status = status;
          return this;
        },
        json: function (body) {
          this.body = body;
          return this;
        },
      };

      try {
        await getQuizzes(req, res);
      } catch (error) {
        expect(error.message).to.equal('Page number must be greater than 0');
        expect(res.status).to.equal(400);
      }
    });

    it('should throw an error if sort parameter is invalid', async () => {
      const req = {
        query: {
          sort: 'invalid',
        },
      };

      const res = {
        status: function (status) {
          this.status = status;
          return this;
        },
        json: function (body) {
          this.body = body;
          return this;
        },
      };

      try {
        await getQuizzes(req, res);
      } catch (error) {
        expect(error.message).to.equal('Invalid sort parameter');
        expect(res.status).to.equal(400);
      }
    });

    it('should throw an error if filter parameter is invalid', async () => {
      const req = {
        query: {
          filter: 'Math,Invalid',
        },
      };

      const res = {
        status: function (status) {
          this.status = status;
          return this;
        },
        json: function (body) {
          this.body = body;
          return this;
        },
      };

      try {
        await getQuizzes(req, res);
      } catch (error) {
        expect(error.message).to.equal('Invalid filter parameter');
        expect(res.status).to.equal(400);
      }
    });

    it('should throw an error if page number exceeds number of quizzes', async () => {
      const req = {
        query: {
          page: 3,
        },
      };

      const res = {
        status: function (status) {
          this.status = status;
          return this;
        },
        json: function (body) {
          this.body = body;
          return this;
        },
      };

      const countStub = sinon.stub(Quiz, 'countDocuments').resolves(20);

      try {
        await getQuizzes(req, res);
      } catch (error) {
        expect(error.message).to.equal('Page number exceeds number of quizzes');
        expect(res.status).to.equal(400);
      }
    });

    it('should throw an error if quizzes are not found', async () => {
      const req = {
        query: {},
      };

      const res = {
        status: function (status) {
          this.status = status;
          return this;
        },
        json: function (body) {
          this.body = body;
          return this;
        },
      };

      const countStub = sinon.stub(Quiz, 'countDocuments').resolves(0);
      const findStub = sinon.stub(Quiz, 'find').returnsThis();

      const sortStub = sinon.stub().returnsThis();
      const skipStub = sinon.stub().returnsThis();
      const limitStub = sinon.stub().resolves(null);

      const quizzes = {
        sort: sortStub,
        skip: skipStub,
        limit: limitStub,
      };

      findStub.returns(quizzes);

      try {
        await getQuizzes(req, res);
      } catch (error) {
        expect(error.message).to.equal('Quizzes not found');
        expect(res.status).to.equal(404);
      }
    });
  });

  describe('GET /api/quizzes/:id', () => {
    it('should get quiz details', async () => {
      const req = {
        params: {
          id: 'quiz1',
        },
      };

      const res = {
        status: function (status) {
          this.status = status;
          return this;
        },
        json: function (body) {
          this.body = body;
          return this;
        },
      };

      const findByIdStub = sinon.stub(Quiz, 'findById').resolves({
        _id: 'quiz1',
        title: 'Quiz 1',
        description: 'This is Quiz 1',
        tags: ['Math', 'Science'],
        isPublic: true,
        questions: [
          {
            question: 'Question 1',
            options: ['Option 1', 'Option 2'],
            answer: 0,
          },
          {
            question: 'Question 2',
            options: ['Option 1', 'Option 2'],
            answer: 1,
          },
        ],
      });

      await getQuiz(req, res);

      sinon.assert.calledWith(Quiz.findById, 'quiz1');
      expect(res.body).to.deep.equal({
        _id: 'quiz1',
        title: 'Quiz 1',
        description: 'This is Quiz 1',
        tags: ['Math', 'Science'],
        isPublic: true,
        questions: [
          {
            question: 'Question 1',
            options: ['Option 1', 'Option 2'],
            answer: 0,
          },
          {
            question: 'Question 2',
            options: ['Option 1', 'Option 2'],
            answer: 1,
          },
        ],
      });
    });
  });

  describe('POST /api/quizzes', () => {
    it('should add quiz', async () => {
      const req = {
        user: {
          _id: 'user1',
        },
        body: {
          title: 'New Quiz',
          description: 'This is a new quiz',
          tags: ['Math', 'Science'],
          isPublic: true,
          questions: [
            {
              question: 'Question 1',
              options: ['Option 1', 'Option 2'],
              answer: 0,
            },
            {
              question: 'Question 2',
              options: ['Option 1', 'Option 2'],
              answer: 1,
            },
          ],
        },
      };

      const res = {
        status: function (status) {
          this.status = status;
          return this;
        },
        json: function (body) {
          this.body = body;
          return this;
        },
      };

      const createStub = sinon.stub(Quiz, 'create').resolves({
        _id: 'quiz2',
        title: 'New Quiz',
        description: 'This is a new quiz',
        tags: ['Math', 'Science'],
        isPublic: true,
        questions: [
          {
            question: 'Question 1',
            options: ['Option 1', 'Option 2'],
            answer: 0,
          },
          {
            question: 'Question 2',
            options: ['Option 1', 'Option 2'],
            answer: 1,
          },
        ],
      });

      const findByIdAndUpdateStub = sinon
        .stub(User, 'findByIdAndUpdate')
        .resolves({
          _id: 'user1',
          quizzes: ['quiz2'],
        });

      await addQuiz(req, res);

      sinon.assert.calledWith(Quiz.create, {
        creator: 'user1',
        title: 'New Quiz',
        description: 'This is a new quiz',
        tags: ['Math', 'Science'],
        isPublic: true,
        questions: [
          {
            question: 'Question 1',
            options: ['Option 1', 'Option 2'],
            answer: 0,
          },
          {
            question: 'Question 2',
            options: ['Option 1', 'Option 2'],
            answer: 1,
          },
        ],
      });
      sinon.assert.calledWith(User.findByIdAndUpdate, 'user1', {
        $push: { quizzes: 'quiz2' },
      });
      expect(res.body).to.deep.equal({
        message: 'Quiz created',
      });
    });
  });

  describe('DELETE /api/quizzes/:id', () => {
    it('should delete quiz', async () => {
      const req = {
        user: {
          _id: 'user1',
        },
        params: {
          id: 'quiz1',
        },
      };

      const res = {
        status: function (status) {
          this.status = status;
          return this;
        },
        json: function (body) {
          this.body = body;
          return this;
        },
      };

      const findByIdStub = sinon.stub(Quiz, 'findById').resolves({
        _id: 'quiz1',
        title: 'Quiz 1',
        description: 'This is Quiz 1',
        tags: ['Math', 'Science'],
        isPublic: true,
        questions: [
          {
            question: 'Question 1',
            options: ['Option 1', 'Option 2'],
            answer: 0,
          },
          {
            question: 'Question 2',
            options: ['Option 1', 'Option 2'],
            answer: 1,
          },
        ],
        creator: 'user1',
        remove: sinon.stub().resolves(),
      });

      const findByIdAndUpdateStub = sinon
        .stub(User, 'findByIdAndUpdate')
        .resolves({
          _id: 'user1',
          quizzes: [],
        });

      await removeQuiz(req, res);

      sinon.assert.calledWith(Quiz.findById, 'quiz1');
      sinon.assert.calledWith(User.findByIdAndUpdate, 'user1', {
        $pull: { quizzes: 'quiz1' },
      });
      expect(res.body).to.deep.equal({
        message: 'Quiz deleted',
      });
    });
  });

  describe('PUT /api/quizzes/:id', () => {
    it('should update quiz and change isPublic', async () => {
      const req = {
        user: {
          _id: 'user1',
        },
        params: {
          id: 'quiz1',
        },
        body: {
          title: 'Updated Quiz',
          description: 'This is an updated quiz',
          tags: ['Math', 'Science'],
          isPublic: false,
          questions: [
            {
              question: 'Question 1',
              options: ['Option 1', 'Option 2'],
              answer: 0,
            },
            {
              question: 'Question 2',
              options: ['Option 1', 'Option 2'],
              answer: 1,
            },
          ],
        },
      };

      const res = {
        status: function (status) {
          this.status = status;
          return this;
        },
        json: function (body) {
          this.body = body;
          return this;
        },
      };

      const findByIdStub = sinon.stub(Quiz, 'findById').resolves({
        _id: 'quiz1',
        title: 'Quiz 1',
        description: 'This is Quiz 1',
        tags: ['Math', 'Science'],
        isPublic: true,
        questions: [
          {
            question: 'Question 1',
            options: ['Option 1', 'Option 2'],
            answer: 0,
          },
          {
            question: 'Question 2',
            options: ['Option 1', 'Option 2'],
            answer: 1,
          },
        ],
        creator: 'user1',
        save: sinon.stub().resolves(),
      });

      await updateQuiz(req, res);

      sinon.assert.calledWith(Quiz.findById, 'quiz1');
      expect(res.body).to.deep.equal({
        publicationChange: true,
        message: 'Quiz updated',
      });
    });

    it('should update quiz without changing isPublic', async () => {
      const req = {
        user: {
          _id: 'user1',
        },
        params: {
          id: 'quiz1',
        },
        body: {
          title: 'Updated Quiz',
          description: 'This is an updated quiz',
          tags: ['Math', 'Science'],
          isPublic: true,
          questions: [
            {
              question: 'Question 1',
              options: ['Option 1', 'Option 2'],
              answer: 0,
            },
            {
              question: 'Question 2',
              options: ['Option 1', 'Option 2'],
              answer: 1,
            },
          ],
        },
      };

      const res = {
        status: function (status) {
          this.status = status;
          return this;
        },
        json: function (body) {
          this.body = body;
          return this;
        },
      };

      const findByIdStub = sinon.stub(Quiz, 'findById').resolves({
        _id: 'quiz1',
        title: 'Quiz 1',
        description: 'This is Quiz 1',
        tags: ['Math', 'Science'],
        isPublic: true,
        questions: [
          {
            question: 'Question 1',
            options: ['Option 1', 'Option 2'],
            answer: 0,
          },
          {
            question: 'Question 2',
            options: ['Option 1', 'Option 2'],
            answer: 1,
          },
        ],
        creator: 'user1',
        save: sinon.stub().resolves(),
      });

      await updateQuiz(req, res);

      sinon.assert.calledWith(Quiz.findById, 'quiz1');
      expect(res.body).to.deep.equal({
        publicationChange: false,
        message: 'Quiz updated',
      });
    });
  });
});
