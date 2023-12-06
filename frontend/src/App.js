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
import UserSettings from './pages/UserSettings';
import Quizzes from './pages/Quizzes';

function App() {
  return (
    <div className="relative overflow-hidden min-h-screen">
      <Header />
      <Route path="/" component={Main}/>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/my-account" component={MyAccount} />
      <Route path="/my-account/settings" component={UserSettings} />
      <Route path="/quizzes" component={Quizzes} />
      <ToastContainer theme="dark" />
    </div>
  );
}

export default App;
