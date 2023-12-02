import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { toast } from 'react-toastify';
import {
  useGetUserQuery,
  useGetUserQuizzesQuery,
} from '../slices/auth/usersApiSlice';

import Button from '../components/Button';
import Loader from '../components/Loader';
import Spinner from '../components/Spinner';
import BgFlourish from '../components/BgFlourish';
import QuizCard from '../components/QuizCard';
import { Cog6ToothIcon, PlusIcon } from '@heroicons/react/24/outline';

function MyAccount() {
  const [location, navigate] = useLocation();

  const { data: user, isLoading } = useGetUserQuery();
  const { data: quizzes, isLoading: isLoadingQuizzes } =
    useGetUserQuizzesQuery();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <BgFlourish flourish="3" />

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-24 p-6">
        <div className="flex flex-col justify-self-end items-center gap-6">
          <div className="rounded-full p-6 bg-blue-violet/50 border-4 border-white/70">
            <img
              className="w-28 aspect-square"
              src={
                process.env.PUBLIC_URL + `/avatars/avatar-${user.avatar}.svg`
              }
              alt={`Avatar ${user.avatar}`}
            />
          </div>
          <h1 className="text-white text-3xl font-bold text-center">
            {user.username}
          </h1>
          <Link to="/my-account/settings">
            <Button>
              <Cog6ToothIcon className="w-6 h-6" />
              Settings
            </Button>
          </Link>
        </div>

        <ul className="flex flex-col gap-4 text-white text-xl">
          <li className="flex justify-between gap-10">
            <span>Quizzes Taken</span>
            <span>{user.quizzesTaken}</span>
          </li>
          <li className="flex justify-between gap-10">
            <span>Quizzes Created</span>
            {isLoadingQuizzes ? <Spinner /> : <span>{quizzes.length}</span>}
          </li>
          <li className="flex justify-between gap-10">
            <span>Highest Score</span>
            <span>{user.highScore}</span>
          </li>
        </ul>
      </div>

      <div className="mx-4 my-8 sm:mx-20">
        <div className="flex flex-col items-center gap-4 my-8">
          <h1 className="text-white text-3xl font-bold text-center">
            My Quizzes
          </h1>
          <Link to="/quizzes/create">
            <Button type="secondary">
              <PlusIcon className="w-6 h-6" />
              Create quiz
            </Button>
          </Link>
        </div>

        {isLoadingQuizzes ? (
          <Spinner />
        ) : !quizzes.length ? (
          <div className="flex justify-center">
            <h3 className="text-gray-200">
              You have not created any quizzes yet.
            </h3>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-8">
            {quizzes.map((quizId) => (
              <QuizCard quizId={quizId} isOwned />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default MyAccount;
