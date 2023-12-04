const setupWebSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected: ', socket.id); // Just for Testing
        socket.on('disconnect', () => { 
            console.log('User disconnected');
        });

        // Event Listeners
        socket.on('checkRoom', (roomCode) => {
            if(io.sockets.adapter.rooms.has(roomCode)){ // making sure the room exists
                socket.emit('validRoom', roomCode);
            } else {
                socket.emit('invalidRoom', roomCode);
            }
        })
        socket.on('joinRoom', ({roomCode, username}) => {
            if(io.sockets.adapter.rooms.has(roomCode)){ // making sure the room exists before joining
                socket.join(roomCode); // Putting the client into the room
                socket.to(roomCode).emit('userJoined', {roomCode, username});
            } else {
                socket.emit('invalidRoom', roomCode);
            }
        })
        // Leaving room exists assuming we let clients leave rooms
        socket.on('leaveRoom', ({roomCode, username}) => {
            if(io.sockets.adapter.rooms.has(roomCode)){ 
                socket.leave(roomCode);
                socket.to(roomCode).emit('userLeft', {roomCode, username});
            } 
        })
        socket.on('createQuiz', (roomCode) => {
            socket.join(roomCode); // Having the host join the room, ends up creating the room
        })
        socket.on('startQuiz', ({roomCode, quizID}) => {
            // Since quiz got started, we have to notify all the clients (in the respective namespace)
            io.to(roomCode).emit('quizStarted', {roomCode, quizID});
        })
        socket.on('endQuiz', ({roomCode, quizID}) => {
            // Since quiz ended, we have to notify all the clients (in the respective namespace)
            io.to(roomCode).emit('quizEnded', {roomCode, quizID});
            io.to(roomCode).socketsLeave(roomCode);
        })
    });
};

export default setupWebSocket;