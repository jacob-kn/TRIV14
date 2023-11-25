import React, { useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../slices/auth/usersApiSlice';
import { logout } from '../slices/auth/authSlice';
import { Link, useLocation } from 'wouter';

import Button from './Button';
import {
  UserIcon,
  Bars3Icon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';

function Header() {
  const [location, navigate] = useLocation();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const [logoutApiCall] = useLogoutMutation();

  const onLogout = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <header className="flex items-center py-5 px-20 mb-10">
        <Link to="/">
          <img
            src={process.env.PUBLIC_URL + '/logo.png'}
            className="w-24 hover:cursor-pointer hover:opacity-70"
          />
        </Link>

        <div className="flex grow ml-4">
          <Link to="/">
            <Button type="tertiary">Play</Button>
          </Link>
          <Button type="tertiary">Quizzes</Button>
        </div>

        <div className="flex gap-2">
          {userInfo ? (
            <>
              <Button type="tertiary" onClick={onLogout}>
                <ArrowLeftOnRectangleIcon className="w-6 h-6" />
                Logout
              </Button>
              <Link to="/my-account">
                <Button>
                  <UserIcon className="w-6 h-6" />
                  My Account
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button type="tertiary">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </header>
    </>
  );
}

export default Header;
