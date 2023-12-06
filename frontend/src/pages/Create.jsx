import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import Button from '../components/Button';
import Loader from '../components/Loader';
import IconButton from '../components/IconButton';
import BgFlourish from '../components/BgFlourish';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useAddQuizMutation } from '../slices/quizzesApiSlice';
import { toast } from 'react-toastify';

function Create() {
  const [addQuiz, { isLoading }] = useAddQuizMutation();
  const [, navigate] = useLocation();

  const defaultTF = [
    { text: '', isCorrect: true },
    { text: '', isCorrect: false },
  ]

  const defaultOptions = [
    { text: '', isCorrect: true },
    { text: '', isCorrect: true },
    { text: '', isCorrect: true },
    { text: '', isCorrect: true },
  ];
  const defaultQuestion = {
    content: '',
    type: 'Multiple Choice',
    options: defaultOptions,
  };

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  const [currentQuestions, setCurrentQuestions] = useState([defaultQuestion]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [questionType, setQuestionType] = useState('Multiple Choice');
  const [questionContent, setQuestionContent] = useState('');
  
  const [currentAnswers, setCurrentAnswers] = useState(defaultOptions);
  const [answerCount, setAnswerCount] = useState(4);

  const changeQuestion = (index) => {
    if (index !== currentQuestionIndex) {
      // Save the current question's state before switching
      const updatedQuestions = currentQuestions.map((question, i) => {
        if (i === currentQuestionIndex) {
          return {
            ...question,
            type: questionType,
            content: questionContent,
            options: currentAnswers
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
      setCurrentAnswers(selectedQuestion.options);
      setCurrentQuestions(updatedQuestions);
      setAnswerCount(selectedQuestion.options.length);
      
    }
  }

  const handleTitleTextChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
  };

  const handleDescriptionTextChange = (e) => {
    const newDesc = e.target.value;
    setDescription(newDesc);
  }

  const addQuestion = () => {
    const newQuestion = { ...defaultQuestion }; // Create a copy of defaultQuestion
    setCurrentQuestions([...currentQuestions, newQuestion]); // Add the new question
  };

  const removeQuestion = (index) => {
    if (currentQuestions.length > 1) {
      if(currentQuestionIndex === index && currentQuestionIndex > 0) {
        
        changeQuestion(index - 1);
      }
      else if(currentQuestionIndex === index) {
          changeQuestion(index + 1);
          setCurrentQuestionIndex(0);
      }
    
      const updatedQuestions = currentQuestions.filter((_, i) => i !== index); // Remove the corresponding question when its Delete button is clicked
      setCurrentQuestions(updatedQuestions);
    }
    else {
      toast.error("You cannot delete your only question");
    }
  };

  const handleQuestionTypeChange = (event) => {
    setQuestionType(event.target.value); // Update the question type based on dropdown selection
    // Adjust options if switching from Fill in the Blank to multiple choice
    if (event.target.value === 'Multiple Choice' && answerCount > 4) {
      setAnswerCount(4);
    }
    if (event.target.value === 'Multiple Choice' && answerCount < 2) {
      setAnswerCount(2);
      setCurrentAnswers(defaultTF);
    }
  };

  const addAnswer = () => {
    if ((questionType === 'Fill in the Blank' && answerCount < 100) || (questionType === 'Multiple Choice' && answerCount < 4)) {
      const newAnswer = { text: '', correct: true }; // Create a new empty answer object
      setCurrentAnswers(prevAnswers => [...prevAnswers, newAnswer]); // Add the new answer to the currentAnswers state
      setAnswerCount(answerCount + 1);
    }
  };

  const removeAnswer = (index) => {
    if ((questionType === 'Fill in the Blank' && answerCount > 1) || (questionType === 'Multiple Choice' && answerCount > 2)) {
      const updatedAnswers = currentAnswers.filter((_, i) => i !== index); // Remove the corresponding question when its Delete button is clicked
      setCurrentAnswers(updatedAnswers);
      setAnswerCount(answerCount - 1);
    }
    else {
      toast.error("Deletion failed; Your question currently has the minimum quanitity of answers.");
    }
  };

  const handleAnswerTextChange = (e, index) => {
    const updatedAnswers = [...currentAnswers];
    updatedAnswers[index].text = e.target.value;
    setCurrentAnswers(updatedAnswers);
  };

  const handleCorrectnessChange = (e, index) => {
    const updatedAnswers = [...currentAnswers];
    updatedAnswers[index].isCorrect = e.target.checked;
    setCurrentAnswers(updatedAnswers);
  };

  const handleSaveQuiz = async () => {

    const updatedQuestions = currentQuestions.map((question, i) => {
        if (i === currentQuestionIndex) {
          return {
            ...question,
            type: questionType,
            question: questionContent,
            options: currentAnswers
          };
        }
        return question;
      });

    const checkboxes = document.querySelectorAll('#tagboxes input[type="checkbox"]:checked');
    const tags = Array.from(checkboxes).map((checkbox) => checkbox.value);
    
    const thisQuiz = {
      title,
      description,
      tags,
      isPublic,
      questions: updatedQuestions,
      
    };

    console.log(thisQuiz);

    try {
      await addQuiz(thisQuiz).unwrap();
      toast.success('Quiz created!');
      navigate('/my-account'); 
    } catch (error) {
      toast.error('Unable to create quiz');
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-row gap-9 ml-10">
        <BgFlourish flourish="3" />
        
        {/* List of Questions */}
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
        <input
            type="text"
            id={`title`}
            name={`title`}
            value={title}
            placeholder="Title"
            className='text-black rounded-md p-1 mr-auto w-5/6'
            onChange={(e) => handleTitleTextChange(e)}
          />
          <textarea 
            value={description} 
            onChange={(e) => handleDescriptionTextChange(e)} 
            id="desc" 
            name="desc" 
            placeholder={`Description`} 
            className="text-black w-full resize-none rounded-md">
          </textarea>

            <div id="tagboxes" className='flex flex-row gap-10 '>
              <label>
                <input type="checkbox" name="Math" value=" Math" />
                Math
              </label>
              <label>
                <input type="checkbox" name="Science" value=" Science" />
                Science
              </label>
              <label>
                <input type="checkbox" name="History" value=" History" />
                History
              </label>
              <label>
                <input type="checkbox" name="Literature" value=" Literature" />
                Literature
              </label>
              <label>
                <input type="checkbox" name="Geography" value=" Geography" />
                Geography
              </label>
              <label>
                <input type="checkbox" name="PopCulture" value=" Pop Culture" />
                Pop Culture
              </label>
            </div>

            
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
                    <option value="Multiple Choice">Multiple choice</option>
                    <option value="Fill in the Blank">Fill in the Blank</option>
                </select>
            </div>
    
            {/* Text field for Question */}
            <div className="flex flex-col gap-2 mr-auto w-full">
                <label htmlFor="questionInput">Question</label>
                <textarea value={questionContent} onChange={(e) => setQuestionContent(e.target.value)} id="questionInput" name="questionInput" placeholder={`Enter question`} className="text-black h-20 resize-none rounded-md"></textarea>
            </div>

            {/*Render Multiple Choice */}
            {questionType === 'Multiple Choice' && (
            <div className='flex flex-row gap-4 w-full justify-between'>
                {Array.from({ length: answerCount }).map((_, index) => (
                
                <div name="mcQs" key={index} className={`bg-${['blue-violet', 'blue-violet', 'blue-violet', 'blue-violet'][index]} flex-grow rounded-md`}>
                    <div className='flex justify-between'>
                    <IconButton className="inline m-1" type="secondary" onClick={() => removeAnswer(index)}>
                        <TrashIcon className="w-6 h-6" />
                    </IconButton>
                    <input
                      type="checkbox"
                      checked={currentAnswers[index]?.isCorrect}
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
                      placeholder={`Answer ${index + 1}`}
                      className='text-black rounded-md p-1 m-3 w-5/6'
                      value={currentAnswers[index].text || ''}
                      onChange={(e) => handleAnswerTextChange(e, index)}
                    />
                </div>
                ))}
                {answerCount < 4 && <Button onClick={addAnswer}>+</Button>}
            </div>              
            )}
            

            {/* Render text fields for Fill in the Blanks */}
            {questionType === 'Fill in the Blank' && (
            <div className="flex flex-col gap-4 w-full justify-between">
                {/* Render text fields for Fill in the Blanks */}
                {Array.from({ length: answerCount }).map((_, index) => (
                <div key={index} className="bg-haiti rounded-md px-2 py-4 flex flex-row ">
                    <input
                    type="text"
                    id={`input${index + 1}`}
                    name={`input${index + 1}`}
                    placeholder={`Fill in the Blank ${index + 1}`}
                    className="text-black  rounded-md p-1 w-full"
                    value={currentAnswers[index].text || ''}
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
              <Link to="/my-account">
                <Button isSubmit type="tertiary" className="w-full">
                  Exit
                </Button>
              </Link>
              <Button isSubmit type="secondary" className="w-full" onClick={handleSaveQuiz}>
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