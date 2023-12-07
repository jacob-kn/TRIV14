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
    <div className="flex flex-col md:flex-row gap-9 ml-10">
      <BgFlourish flourish="3" />
      
      <div>
        <QuizCard quizId={quizId} isOwned />
        <Link to="/">
          <Button className="w-96 my-4 ">Host this quiz!</Button>
        </Link>
      </div>

      <div className="relative flex flex-col gap-4 items-center p-6 rounded-xl bg-surface text-white md:w-5/12 lg:w-7/12 xl:w-2/3 mr-10 mb-10">
        
        <h2 className="mr-auto font-bold text-2xl">Questions ({quiz.questions.length})</h2>
        

        <ul className="w-full md:max-w-7xl">
          {quiz.questions.map((question, index) => (
            <li className="border border-surface-500 rounded-lg w-full md:w-auto p-2 my-4" key={index}>
              <div className='text-lg'>
                Question {index + 1} - {question.type}
              </div>
              
              <div className='font-bold text-ellipsis overflow-hidden'>
                {question.question}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Overview;