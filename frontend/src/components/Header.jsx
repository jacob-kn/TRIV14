import React, { useState, useEffect, useRef } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../slices/auth/usersApiSlice';
import { logout } from '../slices/auth/authSlice';
import { Link, useLocation } from 'wouter';

import Button from './Button';
import IconButton from './IconButton';
import Divider from './Divider';
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
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Add state for menu open/close
  const menuRef = useRef(null);

  const onLogout = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/');
    } catch (err) {
      console.log(err);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const onLogin = () => {
    setIsMenuOpen(false);
  };

  const onRegister = () => {
    setIsMenuOpen(false);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className="flex items-center py-5 px-6 mb-2 md:px-20 md:mb-10">
        <Link to="/">
          <img
            src={process.env.PUBLIC_URL + '/logo.png'}
            className="w-28 hover:cursor-pointer hover:opacity-70"
          />
        </Link>

        <div className="flex-grow ml-4">
          <div className="hidden md:flex gap-2">
            <Link to="/">
              <Button type="tertiary">Play</Button>
            </Link>
            <Link to="/quizzes">
              <Button type="tertiary">Quizzes</Button>
            </Link>
          </div>
        </div>

        <div className="relative inline-block md:hidden" ref={menuRef}>
          <IconButton
            type="secondary"
            className="bg-surface"
            onClick={toggleMenu}
          >
            <Bars3Icon className="w-10 h-10" />
          </IconButton>

          {isMenuOpen && (
            <div className="absolute flex flex-col right-0 gap-2 p-4 justify-center items-center z-50 mt-2 bg-surface border border-haiti rounded-md shadow-lg">
              <div className="flex flex-col gap-1 items-stretch [&>Button]:flex-grow w-[50vw] h-[300px]">
                <Button
                  type="tertiary"
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate('/');
                  }}
                >
                  Play
                </Button>
                <Button
                  type="tertiary"
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate('/quizzes');
                  }}
                >
                  Quizzes
                </Button>
                <div className="bg-gray-400 h-[1px]"></div>
                {userInfo ? (
                  <>
                    <Button
                      type="tertiary"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onLogout();
                      }}
                    >
                      <ArrowLeftOnRectangleIcon className="w-6 h-6" />
                      Logout
                    </Button>
                    <Button
                      onClick={() => {
                        setIsMenuOpen(false);
                        navigate('/my-account');
                      }}
                    >
                      <UserIcon className="w-6 h-6" />
                      My Account
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      type="tertiary"
                      onClick={() => {
                        setIsMenuOpen(false);
                        navigate('/login');
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      onClick={() => {
                        setIsMenuOpen(false);
                        navigate('/register');
                      }}
                    >
                      Sign up
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="hidden md:flex gap-2">
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
