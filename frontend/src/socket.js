import io from 'socket.io-client';

const port = process.env.PORT || 5000;
const socket = io(`http://localhost:${port}`);

export { socket };