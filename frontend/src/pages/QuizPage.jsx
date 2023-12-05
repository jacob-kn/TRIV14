import { useEffect, useState } from "react";
import MultipleChoice from "../components/MultipleChoice";
import FillInTheBlanks from "../components/FillInTheBlanks";

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState();
  const [selectedButton, setSelectedButton] = useState(null);
  const totalSeconds = 60;
  const questionIndex = 1;

  const data = [
    {
      type: "mc",
      question: "What geometric shapes is generally used for stop signs?",
      options: [
        {
          text: "Circle",
        },
        {
          text: "Octagon",
        },
        {
          text: "Rectangle",
        },
        {
          text: "Triangle",
        },
      ],
    },
    {
      type: "fitb",
      question: "Guess the animal!",
      options: [
        {
          text: "The quick brown _ jumps over the lazy dog.",
        },
        {
          text: " _ have long necks.",
        },
      ],
    },
    {
      type: "mc",
      question: "What geometric shapes is generally used for stop signs?",
      options: [
        {
          text: "Answer1",
        },
        {
          text: "Answer2",
        },
        {
          text: "Answer3",
        },
        {
          text: "Answer4",
        },
      ],
    },
  ];

  useEffect(() => {
    setCurrentQuestion(data[questionIndex]);
  }, [questionIndex]);

  const handleSelect = (buttonId) => {
    setSelectedButton(buttonId);
    // Button logic here
    console.log(`Button ${buttonId} clicked`);
  };

  return (
    <>
      {currentQuestion ? (
        <>
          {currentQuestion.type === "mc" ? (
            <MultipleChoice
              question={currentQuestion.question}
              options={currentQuestion.options}
            />
          ) : (
            <FillInTheBlanks
              question={currentQuestion.question}
              options={currentQuestion.options}
            />
          )}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}
