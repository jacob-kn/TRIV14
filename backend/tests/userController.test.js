import supertest from 'supertest';
import chai from 'chai';
import app from '../server.js';
import User from '../models/userModel.js';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import sinon from 'sinon';
import { getUserQuizzes } from '../controllers/userController.js';

const { expect } = chai;
const request = supertest(app);

describe('User Controller', () => {
  let user;
  let authToken;
  let mongoServer;

  before(async () => {
    mongoServer = await MongoMemoryServer.create();

    const mongoUri = mongoServer.getUri(); // Get the URI after starting the server

    // Connect to the in-memory database
    await mongoose.connect(mongoUri);

    // Create a test user
    user = await User.create({
      email: 'test@example.com',
      username: 'testuser',
      password: 'testpassword',
    });

    // Login and get the authentication token
    const loginRes = await request
      .post('/api/users/login')
      .send({ email: 'test@example.com', password: 'testpassword' });

    authToken = loginRes.headers['set-cookie'][0].split(';')[0];
  });

  after(async () => {
    // Delete the test user
    await User.deleteOne({ _id: user._id });

    // Disconnect the in-memory database
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe('POST /api/users', () => {
    let createdUser;

    afterEach(async () => {
      // Delete the created user
      if (createdUser) {
        await User.deleteOne({ _id: createdUser._id });
      }
    });

    it('should register a new user', async () => {
      const res = await request.post('/api/users').send({
        email: 'newuser@example.com',
        username: 'newuser',
        password: 'newpassword',
      });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('_id');
      expect(res.body).to.have.property('email', 'newuser@example.com');
      expect(res.body).to.have.property('username', 'newuser');

      // Save the created user for cleanup
      createdUser = res.body;
    });

    it('should return an error if required fields are missing', async () => {
      const res = await request.post('/api/users').send({});

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message', 'Please fill in all fields');
    });

    it('should return an error if email is already registered', async () => {
      const res = await request.post('/api/users').send({
        email: 'test@example.com',
        username: 'newuser',
        password: 'newpassword',
      });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message', 'User already exists');
    });
  });

  describe('POST /api/users/login', () => {
    it('should login and return user details', async () => {
      const res = await request
        .post('/api/users/login')
        .send({ email: 'test@example.com', password: 'testpassword' });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('_id');
      expect(res.body).to.have.property('email', 'test@example.com');
      expect(res.body).to.have.property('username', 'testuser');
    });

    it('should return an error if required fields are missing', async () => {
      const res = await request.post('/api/users/login').send({});

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message', 'Please fill in all fields');
    });

    it('should return an error if email or password is incorrect', async () => {
      const res = await request
        .post('/api/users/login')
        .send({ email: 'test@example.com', password: 'wrongpassword' });

      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('message', 'Invalid email or password');
    });
  });

  describe('POST /api/users/logout', () => {
    it('should logout the user and clear the cookie', async () => {
      const res = await request.post('/api/users/logout');

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal({ message: 'Logged out successfully' });
    });
  });

  describe('GET /api/users/profile', () => {
    it('should get the user profile', async () => {
      const res = await request
        .get('/api/users/profile')
        .set('Cookie', authToken);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('_id');
      expect(res.body).to.have.property('email', 'test@example.com');
      expect(res.body).to.have.property('username', 'testuser');
      expect(res.body).to.have.property('avatar');
      expect(res.body).to.have.property('quizzesTaken');
      expect(res.body).to.have.property('highScore');
    });

    it('should return an error if user is not authenticated', async () => {
      const res = await request.get('/api/users/profile');

      expect(res.status).to.equal(401);
      expect(res.body)
        .to.have.property('message')
        .that.includes('Access not authorized');
    });
  });

  describe('PUT /api/users/profile', () => {
    let originalProfile;

    beforeEach(async () => {
      // Save the original user profile
      const user = await User.findOne({ email: 'test@example.com' });
      originalProfile = {
        _id: user._id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        quizzesTaken: user.quizzesTaken,
        password: user.password,
        highScore: user.highScore,
      };
    });

    afterEach(async () => {
      // Restore the original user profile
      const user = await User.findById(originalProfile._id);
      user.email = originalProfile.email;
      user.username = originalProfile.username;
      user.avatar = originalProfile.avatar;
      user.quizzesTaken = originalProfile.quizzesTaken;
      user.password = originalProfile.password;
      user.highScore = originalProfile.highScore;
      await user.save();
    });

    it('should update the user profile', async () => {
      const user = await User.findOne({ email: 'test@example.com' });

      const updatedProfile = {
        email: 'newemail@example.com',
        username: 'newusername',
        avatar: 5,
        quizzesTaken: 5,
        password: 'newpassword',
        highScore: 100,
      };

      const res = await request
        .put('/api/users/profile')
        .set('Cookie', authToken)
        .send(updatedProfile);

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal({ message: 'User Profile updated' });

      // Verify that the user profile has been updated in the database
      const updatedUser = await User.findById(user._id);
      expect(updatedUser.email).to.equal(updatedProfile.email);
      expect(updatedUser.username).to.equal(updatedProfile.username);
      expect(updatedUser.avatar).to.equal(updatedProfile.avatar);
      expect(updatedUser.quizzesTaken).to.equal(updatedProfile.quizzesTaken);
      expect(await updatedUser.matchPassword(updatedProfile.password)).to.equal(
        true
      );
      expect(updatedUser.highScore).to.equal(updatedProfile.highScore);
    });

    it('should return 400 if email already exists', async () => {
      const res = await request
        .put('/api/users/profile')
        .set('Cookie', authToken)
        .send({ email: 'test@example.com' });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property(
        'message',
        'A user with that email already exists'
      );
    });
  });

  describe('GET /api/users/quizzes', () => {
    let userId;

    before(() => {
      userId = new mongoose.Types.ObjectId();
    });

    afterEach(() => {
      sinon.restore();
    });

    it('should get the user quizzes', async () => {
      const user = {
        _id: userId,
        quizzes: ['quiz1', 'quiz2', 'quiz3', 'quiz4', 'quiz5'],
      };

      const req = {
        user: {
          _id: userId,
        },
        query: {
          page: 1,
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

      sinon.stub(User, 'findById').resolves(user);

      await getUserQuizzes(req, res);

      sinon.assert.calledWith(User.findById, userId);
      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal({
        quizzes: ['quiz1', 'quiz2', 'quiz3', 'quiz4', 'quiz5'],
        totalPages: 1,
      });

      User.findById.restore();
    });

    it('should return an error if page number is less than 1', async () => {
      const req = {
        user: {
          _id: userId,
        },
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
        await getUserQuizzes(req, res);
      } catch (error) {
        expect(error.message).to.equal('Page number must be greater than 0');
      }
    });

    it('should return an error if user is not found', async () => {
      sinon.stub(User, 'findById').resolves(null);

      const req = {
        user: {
          _id: userId,
        },
        query: {
          page: 1,
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
        await getUserQuizzes(req, res);
      } catch (error) {
        expect(error.message).to.equal('User not found');
      }

      User.findById.restore();
    });

    it('should return an error if page number exceeds number of quizzes', async () => {
      const user = {
        _id: userId,
        quizzes: ['quiz1', 'quiz2', 'quiz3', 'quiz4', 'quiz5'],
      };

      sinon.stub(User, 'findById').resolves(user);

      const req = {
        user: {
          _id: userId,
        },
        query: {
          page: 2,
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
        await getUserQuizzes(req, res);
      } catch (error) {
        expect(error.message).to.equal('Page number exceeds number of quizzes');
      }

      User.findById.restore();
    });
  });

  describe('DELETE /api/users', () => {
    it('should delete the current user', async () => {
      const res = await request.delete('/api/users').set('Cookie', authToken);

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal({
        message: 'User and associated quizzes deleted',
      });
    });

    it('should return an error if user is not authenticated', async () => {
      const res = await request.delete('/api/users');

      expect(res.status).to.equal(401);
      expect(res.body)
        .to.have.property('message')
        .that.includes('Access not authorized');
    });
  });
});
