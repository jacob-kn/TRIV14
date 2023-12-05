import React from 'react';

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
import EnterQuiz from './pages/EnterQuiz';
import HostLobby from './pages/HostLobby';
import QuizPage from "./pages/QuizPage";
import HostPage from "./pages/HostPage";

function App() {
  return (
    <div className="relative overflow-hidden">
      <Header />
      <Route path="/" component={Main} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/my-account" component={MyAccount} />

      <Route path="/host/:roomCode" component={HostPage} />
      <Route path="/play/:roomCode" component={QuizPage} />

      <Route path="/enter-quiz" component={EnterQuiz} />
      <Route path="/host-lobby" component={HostLobby} />
      
      <ToastContainer theme="dark" />
    </div>
  );
}

export default App;
