import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
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
import Pagination from '../components/Pagination';
import {
  Cog6ToothIcon,
  ExclamationCircleIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

function MyAccount() {
  const [location, navigate] = useLocation();
  const { userInfo } = useSelector((state) => state.auth);
  const [page, setPage] = useState(1);

  const { data: user, isLoading, isError, error } = useGetUserQuery();
  const {
    data,
    isLoading: isLoadingQuizzes,
    isError: isErrorQuizzes,
    error: errorQuizzes,
  } = useGetUserQuizzesQuery();

  const quizzes = data?.quizzes;
  const totalPages = data?.totalPages;

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  if (isError) {
    return (
      <div className="flex justify-center mt-16">
        <h2 className="flex flex-col items-center text-gray-200 text-2xl">
          <ExclamationCircleIcon className="w-8 h-8" />
          {error?.data?.message || error?.error}
        </h2>
      </div>
    );
  }

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
            {isLoadingQuizzes ? (
              <Spinner />
            ) : isErrorQuizzes ? (
              <h3 className="text-gray-200 flex gap-2">
                <ExclamationCircleIcon className="w-6 h-6" />
                {errorQuizzes?.data?.message || errorQuizzes.error}
              </h3>
            ) : (
              <span>{quizzes.length}</span>
            )}
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

          {isLoadingQuizzes ? (
            <Spinner />
          ) : isErrorQuizzes ? (
            <div className="flex justify-center">
              <h3 className="text-gray-200 flex gap-2">
                <ExclamationCircleIcon className="w-6 h-6" />
                Could not load quizzes. Please try again later.
              </h3>
            </div>
          ) : !quizzes.length ? (
            <div className="flex justify-center">
              <h3 className="text-gray-200">
                You have not created any quizzes yet.
              </h3>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap justify-center gap-8 max-w-[1500px]">
                {quizzes.map((quizId) => (
                  <QuizCard key={quizId} quizId={quizId} isOwned />
                ))}
              </div>
              <Pagination
                totalPages={totalPages}
                currentPage={page}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default MyAccount;
