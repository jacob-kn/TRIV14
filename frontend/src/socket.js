import io from 'socket.io-client';
import React, { createContext, useContext, useEffect, useRef } from 'react';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const socket = useRef();

    useEffect(() => {
        // Initialize the socket only once
        const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000'; // TODO: Add a server url when deployed
        socket.current = io(serverUrl);

        return () => {
            // Disconnect the socket when the component unmounts
            socket.current.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    );
};