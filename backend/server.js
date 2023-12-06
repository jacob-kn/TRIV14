import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

import userRoutes from './routes/userRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import setupSocket from './socket/index.js';

const port = process.env.PORT || 5000;

connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

// routes/endpoints
app.use('/api/users', userRoutes);
app.use('/api/quizzes', quizRoutes);

app.use(notFound);
app.use(errorHandler);

// entry point for websockets (attached the express app to the websocket)
const server = http.createServer(app);
const io = new SocketIOServer(server, {
    cors: {
        origin: process.env.CORS_ORIGIN || "http://localhost:3000", // TODO: CORS_ORIGIN should be the production domain name
        credentials: true,
    },
});
setupSocket(io);

server.listen(port, () => console.log(`Server started on port ${port}`));