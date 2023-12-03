import React, { useState } from 'react';
import { useGetQuizQuery } from '../slices/quizzesApiSlice';
import { Link, useLocation, useParams } from 'wouter';
import Loader from '../components/Loader';
import QuizCard from '../components/QuizCard';
import Button from '../components/Button';
import IconButton from '../components/IconButton';
import DeleteButton from '../components/DeleteButton';
import Divider from '../components/Divider';
import BgFlourish from '../components/BgFlourish';
import { PencilSquareIcon, UserIcon, TrashIcon } from '@heroicons/react/24/outline';

function Edit() {
  const { quizId } = useParams(); // Extract the quizId from the URL parameters
  const { data: quiz, isLoading, isError } = useGetQuizQuery(quizId);

  const [answers, setAnswers] = useState(4); // Initially set to display 4 colored divs
  const [questions, setQuestions] = useState(quiz?.questions || ['']); 
  const [questionType, setQuestionType] = useState('multipleChoice'); // Manage question type selection

  const addQuestion = () => {
    setQuestions([...questions, '']); // Add an empty question when the + button is clicked
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      const updatedQuestions = questions.filter((_, i) => i !== index); // Remove the corresponding question when its Delete button is clicked
      setQuestions(updatedQuestions);
    }
  };

  const handleQuestionTypeChange = (event) => {
    setQuestionType(event.target.value); // Update the question type based on dropdown selection
    // Adjust answers if switching from short answer to multiple choice
    if (event.target.value === 'multipleChoice' && answers > 4) {
      setAnswers(4);
    }
  };

  const addAnswer = () => {
    if ((questionType === 'shortAnswer' && answers < 100) || (questionType === 'multipleChoice' && answers < 4)) {
      setAnswers(answers + 1);
    }
  };

  const removeAnswer = () => {
    if ((questionType === 'shortAnswer' && answers > 1) || (questionType === 'multipleChoice' && answers > 2)) {
      setAnswers(answers - 1);
    }
  };

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
        

        <div className='w-1/12'>
        <ul className=" md:max-w-7xl rounded-md">
          {questions.map((question, index) => (
            <li className="flex justify-between text-white bg-surface rounded-lg w-full md:w-auto p-2 my-4 " key={index}>
              Question {index + 1}
              <IconButton className="inline" type="secondary" onClick={() => removeQuestion(index)}>
                    <TrashIcon className="w-6 h-6" />
            </IconButton>
            </li>
          ))}
        </ul>
        <Button onClick={addQuestion}>+</Button>
      </div>


        

        <div className="relative flex flex-col gap-4 items-center p-6 rounded-xl bg-surface text-white w-4/5 mr-10">
            <h2 className="mr-auto">Question xyz</h2>
    
            {/* Dropdown for Question type */}
                <div className="flex flex-col gap-2 mr-auto w-1/3 rounded-md">
                <label htmlFor="questionType">Question type</label>
                <select
                    id="questionType"
                    name="questionType"
                    className="text-black h-8 rounded-md"
                    value={questionType}
                    onChange={handleQuestionTypeChange}
                >
                    <option value="multipleChoice">Multiple choice</option>
                    <option value="shortAnswer">Short answer</option>
                </select>
            </div>
    
            {/* Text field for Question */}
            <div className="flex flex-col gap-2 mr-auto w-full">
                <label htmlFor="questionInput">Question</label>
                <textarea id="questionInput" name="questionInput" className="text-black h-20 resize-none rounded-md"></textarea>
            </div>


            {questionType === 'multipleChoice' && (
            <div className='flex flex-row gap-4 w-full justify-between'>
                {Array.from({ length: answers }).map((_, index) => (
                
                <div name="mcQs" key={index} className={`bg-${['blue-500', 'red-500', 'green-500', 'purple-500'][index]} flex-grow rounded-md`}>
                    <div className='flex justify-between'>
                    <IconButton className="inline m-1" type="secondary" onClick={() => removeAnswer(index)}>
                        <TrashIcon className="w-6 h-6" />
                    </IconButton>
                    <input type="checkbox" id={`checkbox${index + 1}`} name={`checkbox${index + 1}`} className='ml-auto mr-2' />
                    </div>
                    <input type="text" id={`input${index + 1}`} name={`input${index + 1}`} className='text-black rounded-md p-1 m-3 w-5/6' />
                </div>
                ))}
                {answers < 4 && <Button onClick={addAnswer}>+</Button>}
            </div>              
            )}
            

            {/* Render text fields for short answers */}
            {questionType === 'shortAnswer' && (
            <div className="flex flex-col gap-4 w-full justify-between">
                {/* Render text fields for short answers */}
                {Array.from({ length: answers }).map((_, index) => (
                <div key={index} className="bg-haiti rounded-md px-2 py-4 flex flex-row ">
                    <input
                    type="text"
                    placeholder={`Short Answer ${index + 1}`}
                    className="text-black  rounded-md p-1 w-full"
                    />
                    <IconButton className="inline m-1" type="secondary" onClick={() => removeAnswer(index)}>
                        <TrashIcon className="w-6 h-6" />
                    </IconButton>
                </div>
                ))}
                {answers < 100 && <Button onClick={addAnswer}>+</Button>}
            </div>
            )}

        
            {/* Cancel & Delete Buttons */}
            <div className="grid grid-cols-4 gap-4 w-full">
                <Button isSubmit type="tertiary" className="w-full">
                Cancel
                </Button>
                <Button isSubmit type="secondary" className="w-full">
                Save Quiz
                </Button>
            </div>
            <style jsx>{`
                .grid {
                display: grid;
                grid-template-columns: 1fr 6fr; /* Set column widths as desired */
                gap: 1rem; /* Adjust the gap between columns */
                }
                .grid > * {
                grid-column: span 1; /* Ensure each button spans only 1 column */
                }
            `}</style>
            

        </div>

        

    </div>
  );
}

export default Edit;