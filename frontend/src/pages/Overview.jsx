import React from 'react';
import { useGetQuizQuery } from '../slices/quizzesApiSlice';
import { Link, useLocation, useParams } from 'wouter';
import Loader from '../components/Loader';
import QuizCard from '../components/QuizCard';
import Button from '../components/Button';
import BgFlourish from '../components/BgFlourish';

function Overview() {
  const { quizId } = useParams(); // Extract the quizId from the URL parameters
  const { data: quiz, isLoading, isError } = useGetQuizQuery(quizId);
  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <h1 className="text-white">Error fetching quiz data</h1>;
  }

  if (!quiz) {
    return <h1 className="text-white">No quiz data available</h1>;
  }

  return (
    <div className="flex flex-row gap-9 ml-10">
      <BgFlourish flourish="3" />
      
      <div>
        <QuizCard quizId={quizId} isOwned />
        <Link to="/">
          <Button className="w-full my-4">Host this quiz!</Button>
        </Link>
      </div>

      <div className="relative flex flex-col gap-4 items-center p-6 rounded-xl bg-surface text-white w-4/5 mr-10">
        
        <h2 className="mr-auto">Questions ({quiz.questions.length})</h2>
        
        <ul className="w-full md:max-w-7xl">
          {quiz.questions.map((question, index) => (
            <li className="border border-surface-500 rounded-lg w-full md:w-auto p-2 my-4" key={index}>{question.text}</li>
            // Assuming 'text' is the property in each question object that holds the question text
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Overview;