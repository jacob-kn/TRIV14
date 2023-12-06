import { useEffect, useState } from "react";
import { useGetQuizQuery } from "../slices/quizzesApiSlice";
import Spinner from "../components/Spinner";
import WinnerPage from "./WinnerPage";
import { useParams } from "wouter";
import { useGetUserQuery } from "../slices/auth/usersApiSlice";
import HostLobby from "./HostLobby";
import HostView from "../components/HostView";
import BgFlourish from "../components/BgFlourish";
import CountdownBar from "../components/CountDownTimer";
import MultipleChoice from "../components/MultipleChoice";
import FillInTheBlanks from "../components/FillInTheBlanks";
import Button from "../components/Button";

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
  let questionIndex = 0;

  // updated when the host tries to go to the next question after the last
  let isComplete = false;

  // time remaining
  let timeRemaining = 60;

  // details for the winner

  // temp for testing

  // temp for testing
  const quiz = {
    title: "This is a custom title",
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

  const handleCountdownEnd = () => {
    console.log("Time is up!");
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (isLoadingUser) {
    return <Spinner />;
  } else {
    console.log(user.username);
  }

  if (!isStarted) {
    return (
      <>
        <HostLobby players={players} />
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
    <div className="min-h-fit pb-16 mb-8">
      <BgFlourish flourish="3" />
      <div className="flex flex-col gap-4 items-center justify-center">
        <div className="flex flex-row items-center ">
          <div className="md:hidden flex flex-col items-center justify-center bg-surface w-fit rounded-lg">
            <h2 className="text-white p-2 font-bold md:text-xl">
              Participants
            </h2>
            <p className="text-white p-2 md:text-xl text-center">15</p>
          </div>
          <h1 className="text-white text-2xl font-bold px-4">{quiz.title}</h1>
        </div>
        <CountdownBar
          totalSeconds={timeRemaining}
          onCountdownEnd={handleCountdownEnd}
        />

        <div>
          <h1 className="text-white text-2xl font-bold mb-4 px-4 text-center">
            {quiz.questions[questionIndex].question}
          </h1>
        </div>
        <div className="flex flex-col md:flex-row justify-center w-full h-full px-4">
          <div className="flex flex-col items-center w-1/4">
            <div className="hidden md:block flex flex-col items-center justify-center bg-surface w-3/4 rounded-lg py-2">
              <h2 className="text-white p-2 font-bold md:text-xl text-center">
                Participants
              </h2>
              <p className="text-white p-2 md:text-xl text-center">15</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row flex-wrap justify-center md:w-1/2 gap-4">
            {quiz ? (
              <>
                {quiz.questions[questionIndex].type === "Multiple Choice" ? (
                  <></>
                  // <MultipleChoice
                  //   options={quiz.questions[questionIndex].options}
                  //   isClickable={false}
                  // />
                ) : (
                  <></>
                  // <FillInTheBlanks
                  //   options={quiz.questions[questionIndex].options}
                  // />
                )}
              </>
            ) : (
              <Spinner />
            )}
            {/* {options.map((option, index) => {
          return (
            <Answer
              key={index}
              id={index}
              selected={selectedButton === index}
              onClick={handleSelect}
              clickable={!isClickable}
              className="md:w-2/5 h-12 md:h-24 bg-blue-600"
            >
              {option.text}
            </Answer>
          );
        })} */}
          </div>
          <div className="flex flex-col items-center m-w-fit md:w-1/4">
            <div className="flex flex-col justify-center bg-surface min-w-fit md:w-3/4 rounded-lg my-4 py-2">
              <h2 className="text-white p-2 font-bold md:text-xl text-center">
                {questionIndex + 1} of {quiz.questions.length}
              </h2>
              <div className="flex flex-row md:flex-col gap-4 my-4 items-center justify-center">
                <Button>Next</Button>
              </div>
            </div>
          </div>
        </div>

        {/* {quiz ? (
          <>
            {}
            {quiz.questions[questionIndex].type === "Multiple Choice" ? (
              <MultipleChoice
                options={quiz.questions[questionIndex].options}
                isClickable={false}
              />
            ) : (
              <FillInTheBlanks
                options={quiz.questions[questionIndex].options}
              />
            )}
          </>
        ) : (
          <Spinner />
        )} */}
      </div>
    </div>
  );
}
