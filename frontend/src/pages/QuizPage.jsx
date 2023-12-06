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

export default function QuizPage() {
  const { roomCode } = useParams();
  const [isStarted, setIsStarted] = useState(false);
  const [quizQuestion, setQuizQuestion] = useState();
  const [isClickable, setIsClickable] = useState(true);
  const [answer, setAnswer] = useState("");

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

  // either given by host or incremented by some event (next question event)
  let questionIndex = 0;

  // updated when the host tries to go to the next question after the last
  let isComplete = false;

  // time remaining
  const timeRemaining = 60;

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

  // replace with actual array of players from backend (through sockets)
  const [players, setPlayers] = useState([]);
  //   "Alice",
  //   "Bob",
  //   "Charlie",
  //   "Eve",
  //   "Xander",
  //   "Yvonne",
  //   "Zane",
  // ]);

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
      
      setIsStarted(true);
    });

    return () => {
      socket.off("someEvent", () => {});
    };
  }, [socket]);

  const handleCountdownEnd = () => {
    setIsClickable(false);
    
    console.log("Time is up!");
  };

  const handleUserInput = (ans) => {
    setAnswer(ans);
    console.log("User's Input: " + ans);
  }

  useEffect(() => {
    console.log("Submitting: " + answer);
  }, [isClickable])
  

  if (isLoading) {
    return <Spinner />;
  }

  if (isLoadingUser) {
    return <Spinner />;
  } else {
    // console.log(user.username);
  }

  // console.log(quiz);

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
