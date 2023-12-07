import { handleAnswer, startQuiz, handleNextQuestion } from '../utils/quizLogic.js';
const roomData = new Map();

const setupWebSocket = (io) => {
    io.on('connection', (socket) => {
        var currentRoomId;
        socket.on('disconnect', () => {
                const usersInRoom = roomData.get(currentRoomId);
                usersInRoom.delete(socket.id);
                io.to(currentRoomId).emit('updatedUserList', Array.from(usersInRoom.values()));
        })
        
        // Event Listeners
        socket.on('checkRoom', (roomCode) => {
            console.log("checkRoom (backend): " + roomCode);
            if(io.sockets.adapter.rooms.has(roomCode)){ // making sure the room exists
                socket.emit('validRoom', roomCode);
            } else {
                socket.emit('invalidRoom', roomCode);
            }
        })
        socket.on('joinRoom', (roomCode, username) => {
            if(io.sockets.adapter.rooms.has(roomCode)){ // making sure the room exists before joining
                socket.join(roomCode); // Putting the client into the room
                const usersInRoom = roomData.get(roomCode);
                usersInRoom.set(socket.id, username);
                io.to(roomCode).emit('updatedUserList', Array.from(usersInRoom.values())); // sending client a list of all users in room
                currentRoomId = roomCode;
            } else {
                socket.emit('invalidRoom', roomCode);
            }
        })
        socket.on('createQuiz', (roomCode) => {
            if(!io.sockets.adapter.rooms.has(roomCode)){ 
                socket.join(roomCode); // Having the host join the room, ends up creating the room
                roomData.set(roomCode, new Map());
                socket.emit("roomCreated", roomCode);
            } else {
                socket.emit('roomAlreadyExists', roomCode);
            }
        })
        
        socket.on('startQuiz', ( quiz, roomCode, duration) => { // quiz is literally the json object
            startQuiz(io, quiz, roomCode, duration, socket.id);
        })

        socket.on('endQuiz', (roomCode, quizID) => {
            // Since quiz ended, we have to notify all the clients (in the respective namespace)
            io.to(roomCode).emit('quizEnded', {roomCode, quizID});
            io.to(roomCode).socketsLeave(roomCode);
        })

        socket.on('submitAnswer', (selectedAnswer, roomCode) => {
            handleAnswer(socket.id, selectedAnswer, roomCode);
        })

        socket.on('nextQuestion', (roomCode) => {
            handleNextQuestion(io, socket.id, roomCode);
        })
    });
};

export default setupWebSocket;