import { useEffect, useState } from "react";
import MultipleChoice from "../components/MultipleChoice";
import FillInTheBlanks from "../components/FillInTheBlanks";
import { useGetQuizQuery } from "../slices/quizzesApiSlice";
import Spinner from "../components/Spinner";
import Lobby from "../components/Lobby";
import WinnerPage from "./WinnerPage";
import { useParams } from "wouter";
import { useGetUserQuery } from "../slices/auth/usersApiSlice";

export default function QuizPage() {
  const { roomCode } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState();

  const quizIds = [
    "65691706b7ef6d91783b40b3",
    "6569172db7ef6d91783b40b7",
    "65695f051f91c7420db36625",
    "656b7e516b12c29574edc587",
  ];

  // use quiz id after joining a room to query and get
  const { data: quiz1, isLoading } = useGetQuizQuery(quizIds[3]);
  const { data: user, isLoading: isLoadingUser } = useGetUserQuery();

  // initial: false, changes to true when start quiz event is fired
  let isStarted = true;

  // either given by host or incremented by some event (next question event)
  let questionIndex = 1;

  // updated when the host tries to go to the next question after the last
  let isComplete = false;

  // time remaining
  let timeRemaining = 60;

  // score
  let score = 1234;

  // details for the winner

  // temp for testing
  const quiz = {
    title: "Title 1",
    questions: [
      {
        type: "Multiple Choice",
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
        ],
      },
      {
        type: "Multiple Choice",
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
    ],
  };

  const quiz2 = [
    {
      type: "Multiple Choice",
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
      type: "Multiple Choice",
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

  // replace with actual array of players from backend (through sockets)
  const [players, setPlayers] = useState([
    "Alice",
    "Bob",
    "Charlie",
    "Eve",
    "Xander",
    "Yvonne",
    "Zane",
  ]);

  const submitAnswer = (ans) => {
    console.log("Submitting: " + ans);
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (isLoadingUser) {
    return <Spinner />;
  } else {
    console.log(user.username);
  }

  console.log(quiz);

  if (!isStarted) {
    return (
      <>
        <Lobby players={players} />
      </>
    );
  }

  if (isComplete) {
    return (
      <>
        <WinnerPage />
      </>
    );
  }

  return (
    <>
      {quiz ? (
        <>
          {quiz.questions[questionIndex].type === "Multiple Choice" ? (
            <MultipleChoice
              title={quiz.title}
              question={quiz.questions[questionIndex].question}
              options={quiz.questions[questionIndex].options}
              score={score}
              submit={submitAnswer}
            />
          ) : (
            <FillInTheBlanks
              title={quiz.title}
              question={quiz.questions[questionIndex].question}
              options={quiz.questions[questionIndex].options}
              score={score}
              submit={submitAnswer}
            />
          )}
        </>
      ) : (
        <Spinner />
      )}
    </>
  );
}
