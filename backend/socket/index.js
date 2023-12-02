const setupWebSocket = (io) => {
    io.on('connection', (socket) => {
        // Testing socket
        console.log('A user connected: ', socket.id);
        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
};

export default setupWebSocket;