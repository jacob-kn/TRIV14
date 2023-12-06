import BgFlourish from "../components/BgFlourish";
import CountdownBar from "../components/CountDownTimer";
import { useEffect, useState } from "react";
import MultipleChoice from "../components/MultipleChoice";
import FillInTheBlanks from "../components/FillInTheBlanks";
import { useGetQuizQuery } from "../slices/quizzesApiSlice";
import Spinner from "../components/Spinner";
import Lobby from "../components/Lobby";
import WinnerPage from "./WinnerPage";
import { useParams } from "wouter";
import { useGetUserQuery } from "../slices/auth/usersApiSlice";
import { socket } from "../socket";
import { setAnswer, selectAnswer } from '../slices/quizSlice';
import { useDispatch, useSelector } from "react-redux";

export default function QuizPage() {
  const dispatch = useDispatch();
  const { roomCode } = useParams();
  const [isStarted, setIsStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [quizQuestion, setQuizQuestion] = useState();
  const [isClickable, setIsClickable] = useState(true);
  const [players, setPlayers] = useState([]);
  const answer = useSelector(selectAnswer);
  const timeRemaining = 60;
  const [startCountdown, setStartCountdown] = useState(false);

  // use quiz id after joining a room to query and get
  const { data: user, isLoading } = useGetUserQuery();

  // initial: false, changes to true when start quiz event is fired

  // either given by host or incremented by some event (next question event)

  // updated when the host tries to go to the next question after the last

  // time remaining
  

  // score
  let score = 0;

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

  

  useEffect(() => {
    socket.on("updatedUserList", (playerArray) => {
      console.log(playerArray);
      setPlayers(playerArray);
    });

    socket.on('newQuestion', (questionObject) => {
      console.log("Received question object.");
      // setQuizQuestion(questionObject);
      console.log(questionObject);
      setQuizQuestion(questionObject);
      setStartCountdown(true);
      setIsStarted(true);
    });

    socket.on('correctAnswer', (correctOption) => {
      // players submit when the correctAnswer is emitted which means time is up
      console.log("Submitting: " + answer);
      console.log("For roomcode: " + roomCode);
      socket.emit('submitAnswer', answer, roomCode); //Todo - error
      console.log("Question time is up!\n" + "Correct answer: " + correctOption);
    })

    return () => {
      socket.off("someEvent", () => {});
    };
  }, [socket]);

  const handleCountdownEnd = () => {
    // setIsClickable(false);
    setStartCountdown(false);
    // console.log("Time is up!");
  };

  const handleUserInput = (ans) => {
    dispatch(setAnswer(ans));
    console.log("User's Input: " + answer);
  }  

  if (isLoading) {
    return <Spinner />;
  }

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
      <div className="min-h-fit pb-16 mb-8">
        <BgFlourish flourish="3" />
        <div className="flex flex-col gap-4 items-center justify-center">
          <div className="flex flex-row items-center ">
            <div className="md:hidden flex flex-col items-center justify-center bg-surface w-fit rounded-lg">
              <h2 className="text-white p-2 font-bold md:text-xl">Score</h2>
              <p className="text-white p-2 md:text-xl text-center">{score}</p>
            </div>
            <h1 className="text-white text-2xl font-bold px-4">{quizQuestion.title}</h1>
          </div>
          <CountdownBar
            totalSeconds={timeRemaining}
            onCountdownEnd={handleCountdownEnd}
            startCountdown={startCountdown}
          />
          <div>
            <h1 className="text-white text-2xl font-bold mb-4 px-4 text-center">
              {quizQuestion.question}
            </h1>
          </div>

          {quizQuestion ? (
            <>
              {quizQuestion.type === "Multiple Choice" ? (
                <MultipleChoice
                  options={quizQuestion.options}
                  score={score}
                  userInput={handleUserInput}
                  isClickable={isClickable}
                />
              ) : (
                <FillInTheBlanks
                  options={quizQuestion.options}
                  score={score}
                  userInput={handleUserInput}
                />
              )}
            </>
          ) : (
            <Spinner />
          )}
        </div>
      </div>
    </>
  );
}
