import React from 'react';
import { socket } from './socket';
import { Route } from 'wouter';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//component imports
import Header from './components/Header';

//page imports
import Main from './pages/Main';
import Login from './pages/Login';
import Register from './pages/Register';
import MyAccount from './pages/MyAccount';

function App() {
  
  // Function to join a quiz room
  const joinRoom = (roomCode, username) => {
    socket.emit('joinRoom', { roomCode, username });
  };

  // Function to start a quiz
  const startQuiz = (quiz, roomCode, duration) => {
    socket.emit('startQuiz', { quiz, roomCode, duration });
  };

  // Function to submit an answer
  const submitAnswer = (selectedAnswer, roomCode) => {
    socket.emit('submitAnswer', { selectedAnswer, roomCode });
  };

  // Function for the host to move to the next question
  const nextQuestion = (roomCode) => {
    socket.emit('nextQuestion', roomCode);
  };

  return (
    <div className="relative overflow-hidden">
      <Header />
      <Route path="/" component={() => <Main joinRoom={joinRoom} startQuiz={startQuiz}/>} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/my-account" component={MyAccount} />
      <ToastContainer theme="dark" />
    </div>
  );
}

export default App;
