import React from 'react';
import { toast } from 'react-toastify';
import { Link, useLocation } from 'wouter';

import {
  useGetQuizQuery,
  useRemoveQuizMutation,
  useUpdateQuizMutation,
} from '../slices/quizzesApiSlice';
import {
  ExclamationCircleIcon,
  PencilSquareIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

import Button from './Button';
import IconButton from './IconButton';
import DeleteButton from './DeleteButton';

const QuizCard = ({ quizId, isOwned }) => {
  const {
    data: quiz,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetQuizQuery(quizId);
  const [removeQuiz] = useRemoveQuizMutation();
  const [updateQuiz] = useUpdateQuizMutation();
  const [, navigate] = useLocation();


  const handleDelete = async () => {
    try {
      await removeQuiz(quizId).unwrap();
      toast.success(`Deleted quiz: "${quiz.title}"`);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    try {
      await updateQuiz({ _id: quizId, isPublic: true }).unwrap();
      toast.success(`Published quiz: "${quiz.title}"`);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };
  const handleUnpublish = async () => {
    try {
      await updateQuiz({ _id: quizId, isPublic: false }).unwrap();
      toast.success(`Unpublished quiz: "${quiz.title}"`);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };
  

  if (isError) {
    return (
      <div className="flex items-center px-6 p-6 rounded-xl bg-gray-700 max-w-[24rem] w-[90vw] h-[280px]">
        <h1 className="flex flex-col items-center text-xl text-white sm:text-2xl font-bold text-center w-full px-10 line-clamp-4">
          <ExclamationCircleIcon className="w-8 h-8" />
          Error: {error?.data?.message || error.error}
        </h1>
      </div>
    );
  }

  // Skeleton loading state
  if (isLoading || isFetching || isError) {
    return (
      <div className="flex flex-col gap-6 items-center px-6 p-6 rounded-xl bg-gray-700 max-w-[24rem] w-[90vw]">
        <div className="w-1/2 h-10 rounded-md bg-gray-600 animate-pulse"></div>
        <div className="w-3/4 h-4 rounded-md bg-gray-600 animate-pulse"></div>
        <div className="w-3/4 h-4 -mt-4 rounded-md bg-gray-600 animate-pulse"></div>
        <div className="w-3/4 h-4 -mt-4 rounded-md bg-gray-600 animate-pulse"></div>
        <div className="flex justify-around gap-6 w-full">
          <span className="w-1/3 h-4 rounded-full bg-gray-600 animate-pulse"></span>
          <span className="w-1/3 h-4 rounded-md bg-gray-600 animate-pulse"></span>
        </div>
        {isOwned && (
          <div className="w-1/3 h-10 rounded-md bg-gray-600 animate-pulse"></div>
        )}
      </div>
    );
  }

  return (
    <div className="relative flex flex-col gap-4 p-6 rounded-xl bg-surface text-white max-w-[24rem] w-[90vw]">
      <div
        className="flex flex-col grow gap-4 items-center hover:opacity-80 hover:cursor-pointer"
        onClick={() => navigate(`/quizzes/${quizId}/overview`)}
      >
        <h3 className="text-xl sm:text-2xl font-bold text-center w-full px-10 line-clamp-2">
          {quiz.title}
        </h3>
        <h3 className="text-md text-center line-clamp-3">
          <span>{quiz.description}</span>
        </h3>
        <div className="flex-grow flex justify-around items-end gap-6">
          {quiz.tags && (
            <div className="flex flex-wrap justify-center gap-2">
              {quiz.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-4 py-1 rounded-full bg-blue-violet"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <span className="flex gap-1 py-1 whitespace-nowrap">
            <UserIcon className="w-6 h-6" />
            Plays: {quiz.plays}
          </span>
        </div>
      </div>

      {isOwned && (
        <>
          <DeleteButton
            className="absolute top-4 left-4"
            message="Are you sure you want to delete this quiz?"
            onConfirm={handleDelete}
          />
          <Link to={`/quizzes/${quizId}/edit`}>
            <IconButton type="secondary" className="absolute top-4 right-4">
              <PencilSquareIcon className="w-6 h-6" />
            </IconButton>
          </Link>
          {quiz.isPublic ? (
            <Button type="tertiary" onClick={handleUnpublish}>
              Unpublish
            </Button>
          ) : (
            <Button type="secondary" onClick={handlePublish}>
              Publish
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default QuizCard;
