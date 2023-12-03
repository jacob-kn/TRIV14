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
import Lobby from './pages/Lobby';
import HostLobby from './pages/HostLobby';
import MultipleChoice from "./pages/MultipleChoice"
import FillBlanks from './pages/FillBlanks';
import WinnerPage from './pages/WinnerPage';

function App() {
  return (
    <div className="relative overflow-hidden">
      <Header />
      <Route path="/" component={Main} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/my-account" component={MyAccount} />
      <Route path="/enter-quiz" component={EnterQuiz} />
      <Route path="/lobby" component={Lobby} />
      <Route path="/host-lobby" component={HostLobby} />
      <Route path="/mc" component={MultipleChoice} />
      <Route path="/fb" component={FillBlanks} />
      <Route path="/winner-page" component={WinnerPage} />
      
      <ToastContainer theme="dark" />
    </div>
  );
}

export default App;
