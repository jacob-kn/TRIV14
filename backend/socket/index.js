import { handleAnswer, startQuiz, handleNextQuestion } from '../utils/quizLogic.js';
const roomData = new Map();

const setupWebSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected: ', socket.id); // Just for Testing
        socket.on('disconnect', () => { 
            console.log('User disconnected');
        });

        // Event Listeners
        socket.on('checkRoom', (roomCode) => {
            console.log("checkRoom (backend): " + roomCode);
            if(io.sockets.adapter.rooms.has(roomCode)){ // making sure the room exists
                console.log("do we emit valid room ?");
                socket.emit('validRoom', roomCode);
            } else {
                console.log("room doesn't exist");
                socket.emit('invalidRoom', roomCode);
            }
        })
        socket.on('joinRoom', (roomCode, username) => {
            console.log("joinRoom");
            if(io.sockets.adapter.rooms.has(roomCode)){ // making sure the room exists before joining
                console.log("inside if join room");
                socket.join(roomCode); // Putting the client into the room
                const usersInRoom = roomData.get(roomCode);
                usersInRoom.set(socket.id, username);
                io.to(roomCode).emit('updatedUserList', Array.from(usersInRoom.values())); // sending client a list of all users in room
            } else {
                console.log("inside else join room");
                socket.emit('invalidRoom', roomCode);
            }
        })
        socket.on('createQuiz', (roomCode) => {
            if(!io.sockets.adapter.rooms.has(roomCode)){ 
                socket.join(roomCode); // Having the host join the room, ends up creating the room
                roomData.set(roomCode, new Map());
                socket.emit("roomCreated", roomCode);
                console.log("Room Created with code (backend): " + roomCode);
            } else {
                socket.emit('roomAlreadyExists', roomCode);
            }
        })
        
        socket.on('startQuiz', ( quiz, roomCode, duration) => { // quiz is literally the json object
            console.log(quiz);
            console.log(roomCode);
            console.log(duration);
            startQuiz(io, quiz, roomCode, duration, socket.id);
        })

        socket.on('endQuiz', ({roomCode, quizID}) => {
            // Since quiz ended, we have to notify all the clients (in the respective namespace)
            io.to(roomCode).emit('quizEnded', {roomCode, quizID});
            io.to(roomCode).socketsLeave(roomCode);
        })

        socket.on('submitAnswer', (selectedAnswer, roomCode) => {
            console.log("Handling answer");
            console.log("room code: " + roomCode);
            console.log("answer: " + selectedAnswer);
            handleAnswer(io, socket.id, selectedAnswer, roomCode);
        })

        socket.on('nextQuestion', (roomCode) => {
            handleNextQuestion(io, socket.id, roomCode);
        })
    });
};

export default setupWebSocket;