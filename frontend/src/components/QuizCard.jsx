import React from 'react';
import { twMerge } from 'tailwind-merge';
import { toast } from 'react-toastify';
import { Link } from 'wouter';

import {
  useGetQuizQuery,
  useRemoveQuizMutation,
  useUpdateQuizMutation,
} from '../slices/quizzesApiSlice';
import { PencilSquareIcon, UserIcon } from '@heroicons/react/24/outline';

import Button from './Button';
import IconButton from './IconButton';
import DeleteButton from './DeleteButton';

const QuizCard = ({ quizId, isOwned }) => {
  const { data: quiz, isLoading } = useGetQuizQuery(quizId);
  const [removeQuiz] = useRemoveQuizMutation();
  const [updateQuiz] = useUpdateQuizMutation();

  const handleDelete = async () => {
    try {
      await removeQuiz(quizId);
      toast.success(`Deleted quiz: "${quiz.title}"`);
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error);
    }
  };

  const handlePublish = async () => {
    try {
      await updateQuiz({ _id: quizId, isPublic: true });
      toast.success(`Published quiz: "${quiz.title}"`);
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error);
    }
  };
  const handleUnpublish = async () => {
    try {
      await updateQuiz({ _id: quizId, isPublic: false });
      toast.success(`Unpublished quiz: "${quiz.title}"`);
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error);
    }
  };

  // Skeleton loading state
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 items-center px-6 py-4 rounded-xl bg-gray-600 w-96">
        <div className="w-1/2 h-6 rounded-md bg-gray-500 animate-pulse"></div>
        <div className="w-3/4 h-4 rounded-md bg-gray-500 animate-pulse"></div>
        <div className="flex justify-around gap-6 w-full">
          <span className="w-1/3 h-4 rounded-full bg-gray-500 animate-pulse"></span>
          <span className="w-1/3 h-4 rounded-md bg-gray-500 animate-pulse"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col gap-4 items-center p-6 rounded-xl bg-surface text-white w-96">
      <h3 className="text-2xl font-bold text-center">{quiz.title}</h3>
      <h3 className="flex-grow text-md text-center line-clamp-3">
        <span>{quiz.description}</span>
      </h3>
      <div className="flex justify-around items-center gap-6">
        {quiz.tags && (
          <div className="flex flex-wrap gap-2">
            {quiz.tags.map((tag) => (
              <span className="px-4 py-1 rounded-full bg-blue-violet">
                {tag}
              </span>
            ))}
          </div>
        )}
        <span className="flex gap-1 whitespace-nowrap">
          <UserIcon className="w-6 h-6" />
          Plays: {quiz.plays}
        </span>
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