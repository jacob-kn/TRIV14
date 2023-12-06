import React, { useState } from 'react';

import Button from '../components/Button';
import IconButton from '../components/IconButton';
import BgFlourish from '../components/BgFlourish';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

function Create() {
  const defaultQuestion = {
    content: '',
    type: 'multipleChoice',
    answers: [{ text: 'a', correct: false }, { text: 'b', correct: false }, { text: 'c', correct: false }, { text: 'd', correct: false }],
  };

  const [currentQuestions, setCurrentQuestions] = useState([defaultQuestion]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [answerCount, setAnswerCount] = useState(4);
  
  
  const [questionType, setQuestionType] = useState('multipleChoice');
  const [questionContent, setQuestionContent] = useState('question');
  const [currentAnswers, setCurrentAnswers] = useState(new Array(answerCount).fill({ text: 'answer', correct: false }));


  const changeQuestion = (index) => {
    if (index !== currentQuestionIndex) {
      // Save the current question's state before switching
      const updatedQuestions = currentQuestions.map((question, i) => {
        if (i === currentQuestionIndex) {
          return {
            ...question,
            type: questionType,
            content: questionContent,
            answers: currentAnswers
          };
        }
        return question;
      });

      // Update the current question index
      setCurrentQuestionIndex(index);

      // Retrieve the state for the selected question
      const selectedQuestion = updatedQuestions[index];
      setQuestionType(selectedQuestion.type);
      setQuestionContent(selectedQuestion.content);
      setCurrentAnswers(selectedQuestion.answers);
      setCurrentQuestions(updatedQuestions);
      setAnswerCount(selectedQuestion.answers.length);
      
    }
  }

  const addQuestion = () => {
    const newQuestion = { ...defaultQuestion }; // Create a copy of defaultQuestion
    setCurrentQuestions([...currentQuestions, newQuestion]); // Add the new question
  };

  const removeQuestion = (index) => {
    if(currentQuestionIndex === index && currentQuestionIndex > 0) {
      
      changeQuestion(index - 1);
    }
    else if(currentQuestionIndex === index) {
        changeQuestion(index + 1);
        setCurrentQuestionIndex(0);
    }
    if (currentQuestions.length > 1) {
      const updatedQuestions = currentQuestions.filter((_, i) => i !== index); // Remove the corresponding question when its Delete button is clicked
      setCurrentQuestions(updatedQuestions);
    }
    
  };

  const handleQuestionTypeChange = (event) => {
    setQuestionType(event.target.value); // Update the question type based on dropdown selection
    // Adjust answers if switching from short answer to multiple choice
    if (event.target.value === 'multipleChoice' && answerCount > 4) {
      setAnswerCount(4);
    }
    if (event.target.value === 'multipleChoice' && answerCount < 2) {
      setAnswerCount(2);
    }
  };

  const addAnswer = () => {
    if ((questionType === 'shortAnswer' && answerCount < 100) || (questionType === 'multipleChoice' && answerCount < 4)) {
      const newAnswer = { text: '', correct: false }; // Create a new empty answer object
      setCurrentAnswers(prevAnswers => [...prevAnswers, newAnswer]); // Add the new answer to the currentAnswers state
      setAnswerCount(answerCount + 1);
    }
  };

  const removeAnswer = (index) => {
    if ((questionType === 'shortAnswer' && answerCount > 1) || (questionType === 'multipleChoice' && answerCount > 2)) {

      
      const updatedAnswers = currentAnswers.filter((_, i) => i !== index); // Remove the corresponding question when its Delete button is clicked
      setCurrentAnswers(updatedAnswers);
      setAnswerCount(answerCount - 1);
    }
  };

  const handleAnswerTextChange = (e, index) => {
    const updatedAnswers = [...currentAnswers];
    updatedAnswers[index].text = e.target.value;
    setCurrentAnswers(updatedAnswers);
  };

  const handleCorrectnessChange = (e, index) => {
    const updatedAnswers = [...currentAnswers];
    updatedAnswers[index].correct = e.target.checked;
    setCurrentAnswers(updatedAnswers);
  };


  return (
    <div className="flex flex-row gap-9 ml-10">
        <BgFlourish flourish="3" />
        

        <div className='w-1/12'>
        <ul className=" md:max-w-7xl rounded-md">
          {currentQuestions.map((question, index) => (
            <li className="flex flex-col justify-between text-white bg-surface rounded-lg w-full md:w-auto p-2 my-4 cursor-pointer" key={index}>
              Question {index + 1}
              <div className="flex flex-row justify-between">
                <IconButton className="inline" type="secondary" onClick={() => changeQuestion(index)}>
                    <PencilSquareIcon className="w-6 h-6" />
              </IconButton>
              <IconButton className="inline" type="secondary" onClick={() => removeQuestion(index)}>
                    <TrashIcon className="w-6 h-6" />
              </IconButton>
              </div>
              
            </li>
          ))}
        </ul>
        <Button className="w-full" onClick={addQuestion}>+</Button>
      </div>


        

        <div className="relative flex flex-col gap-4 items-center p-6 rounded-xl bg-surface text-white w-4/5 mr-10">
            <h2 className="mr-auto">Question {currentQuestionIndex + 1}</h2>
    
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
                <textarea value={questionContent} onChange={(e) => setQuestionContent(e.target.value)} id="questionInput" name="questionInput" className="text-black h-20 resize-none rounded-md"></textarea>
            </div>

            {/*Render Multiple Choice */}
            {questionType === 'multipleChoice' && (
            <div className='flex flex-row gap-4 w-full justify-between'>
                {Array.from({ length: answerCount }).map((_, index) => (
                
                <div name="mcQs" key={index} className={`bg-${['blue-violet', 'blue-violet', 'blue-violet', 'blue-violet'][index]} flex-grow rounded-md`}>
                    <div className='flex justify-between'>
                    <IconButton className="inline m-1" type="secondary" onClick={() => removeAnswer(index)}>
                        <TrashIcon className="w-6 h-6" />
                    </IconButton>
                    <input
                      type="checkbox"
                      checked={currentAnswers[index]?.correct || false}
                      id={`checkbox${index + 1}`}
                      name={`checkbox${index + 1}`}
                      className='ml-auto mr-2'
                      onChange={(e) => handleCorrectnessChange(e, index)}
                    />
                    </div>
                    <input
                      type="text"
                      id={`input${index + 1}`}
                      name={`input${index + 1}`}
                      className='text-black rounded-md p-1 m-3 w-5/6'
                      value={currentAnswers[index].text}
                      onChange={(e) => handleAnswerTextChange(e, index)}
                    />
                </div>
                ))}
                {answerCount < 4 && <Button onClick={addAnswer}>+</Button>}
            </div>              
            )}
            

            {/* Render text fields for short answers */}
            {questionType === 'shortAnswer' && (
            <div className="flex flex-col gap-4 w-full justify-between">
                {/* Render text fields for short answers */}
                {Array.from({ length: answerCount }).map((_, index) => (
                <div key={index} className="bg-haiti rounded-md px-2 py-4 flex flex-row ">
                    <input
                    type="text"
                    id={`input${index + 1}`}
                    name={`input${index + 1}`}
                    placeholder={`Short Answer ${index + 1}`}
                    className="text-black  rounded-md p-1 w-full"
                    value={currentAnswers[index].text}
                    onChange={(e) => handleAnswerTextChange(e, index)}
                    />
                    <IconButton className="inline m-1" type="secondary" onClick={() => removeAnswer(index)}>
                        <TrashIcon className="w-6 h-6" />
                    </IconButton>
                </div>
                ))}
                {answerCount < 100 && <Button onClick={addAnswer}>+</Button>}
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

export default Create;