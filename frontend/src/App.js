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

function App() {
  return (
    <div className="relative overflow-hidden">
      <Header />
      <Route path="/" component={Main} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/my-account" component={MyAccount} />
      <ToastContainer theme="dark" />
    </div>
  );
}

export default App;
