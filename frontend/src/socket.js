import io from 'socket.io-client';
const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000'; // TODO: Add a server url when deployed
export const socket = io(serverUrl);