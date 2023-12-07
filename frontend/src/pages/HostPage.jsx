import { useEffect, useState } from "react";
import { useGetQuizQuery } from "../slices/quizzesApiSlice";
import { useParams } from "wouter";
import { useGetUserQuery } from "../slices/auth/usersApiSlice";
import { socket } from "../socket";
import { useSelector } from "react-redux";
import { selectQuizId } from "../slices/quizSlice";
import Spinner from "../components/Spinner";
import WinnerPage from "./WinnerPage";
import HostLobby from "./HostLobby";
import BgFlourish from "../components/BgFlourish";
import CountdownBar from "../components/CountDownTimer";
import Button from "../components/Button";
import Answer from "../components/Answer";
import FillInTheBlank from "../components/FillInTheBlank";

export default function HostPage() {
  const [players, setPlayers] = useState([]);
  const currentQuizId = useSelector(selectQuizId);
  const { roomCode } = useParams();
  const duration = 15;
  const [startCountdown, setStartCountdown] = useState(false);
  const [quizQuestion, setQuizQuestion] = useState();
  const [isStarted, setIsStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState();
  const quizIds = [
    "65691706b7ef6d91783b40b3",
    "6569172db7ef6d91783b40b7",
    "65695f051f91c7420db36625",
    "656b7e516b12c29574edc587",
  ];

  // use quiz id after joining a room to query and get
  const { data: quiz1, isLoading } = useGetQuizQuery(currentQuizId);
  const { data: user, isLoading: isLoadingUser } = useGetUserQuery();

  // initial: false, changes to true when start quiz event is fired

  // either given by host or incremented by some event (next question event)
  let questionIndex = 1;

  // updated when the host tries to go to the next question after the last

  // details for the winner

  useEffect(() => {
    socket.on("updatedUserList", (playerArray) => {
      console.log(playerArray);
      setPlayers(playerArray);
    });

    socket.on("newQuestion", (questionObject) => {
      setQuizQuestion(questionObject);
      setStartCountdown(true);
      setIsStarted(true);
    });

    socket.on("correctAnswer", (correctOption) => {
      setStartCountdown(false);
      console.log(
        "Question time is up!\n" + "Correction option: " + correctOption
      );
    });

    socket.on('updateScore', (scores) => {
      console.log("Updating Scores");
      console.log(scores);
    })

    socket.on('quizEnded', (scores) => {
      console.log("Quiz ended. Logging scores");
      console.log(scores);
      setIsComplete(true);
    })

    return () => {
      socket.off("someEvent", () => {});
    };
  }, [socket]);

  const handleCountdownEnd = () => {
    // setStartCountdown(false);
  };

  const handleStartQuiz = () => {
    console.log("Starting the quiz.");
    socket.emit("startQuiz", quiz1, roomCode, duration);
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (isLoadingUser) {
    return <Spinner />;
  } else {
  }

  if (!isStarted) {
    return (
      <>
        <HostLobby players={players} startQuiz={handleStartQuiz} />
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
            <p className="text-white p-2 md:text-xl text-center">
              {players.length}
            </p>
          </div>
          <h1 className="text-white text-2xl font-bold px-4">
            {quizQuestion.title}
          </h1>
        </div>
        <CountdownBar
          totalSeconds={duration}
          // onCountdownEnd={handleCountdownEnd}
          startCountdown={startCountdown}
        />

        <div>
          <h1 className="text-white text-2xl font-bold mb-4 px-4 text-center">
            {quizQuestion.question}
          </h1>
        </div>
        <div className="flex flex-col md:flex-row justify-center w-full h-full px-4">
          <div className="flex flex-col items-center w-1/4">
            <div className="hidden md:block flex flex-col items-center justify-center bg-surface w-3/4 rounded-lg py-2">
              <h2 className="text-white p-2 font-bold md:text-xl text-center">
                Participants
              </h2>
              <p className="text-white p-2 md:text-xl text-center">
                {players.length}
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row flex-wrap justify-center md:w-1/2 gap-4">
            {quizQuestion ? (
              <>
                {quizQuestion.type === "Multiple Choice" ? (
                  <>
                    {quizQuestion.options.map((option, index) => {
                      return (
                        <Answer
                          key={index}
                          id={index}
                          selected={false}
                          onClick={() => {}}
                          clickable={false}
                          className="md:w-2/5 h-12 md:h-24 bg-blue-600"
                        >
                          {option.text}
                        </Answer>
                      );
                    })}
                  </>
                ) : (
                  <p>
                    <input
                      onChange={() => {}}
                      className="mx-1 text-black rounded placeholder:ml-2 focus:border-sky-500 placeholder:text-gray-500 pl-[8px] placeholder:italic"
                      placeholder="Answer"
                    ></input>
                    {/* {quizQuestion.map((option, index) => {
                      return (
                        
                        <FillInTheBlank
                          key={index}
                          paragraphText={option.text}
                          onTextChange={() => {}}
                        />
                      );
                    })} */}
                  </p>
                )}
              </>
            ) : (
              <Spinner />
            )}
          </div>
          <div className="flex flex-col items-center m-w-fit md:w-1/4">
            <div className="flex flex-col justify-center bg-surface min-w-fit md:w-3/4 rounded-lg my-4 py-2">
              <h2 className="text-white p-2 font-bold md:text-xl text-center">
                {questionIndex} of {quiz1.questions.length}
              </h2>
              <div className="flex flex-row md:flex-col gap-4 my-4 items-center justify-center">
                <button
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-semibold whitespace-nowrap hover:scale-[1.03] bg-white text-bunker-100"
                  style={{
                    opacity: startCountdown ? "0.5" : "1",
                    // border: selected ? "5px solid lightgreen" : "none",
                  }}
                  onClick={() => {
                    console.log(
                      "Next button clicked - going to the next question."
                    );
                    socket.emit("nextQuestion", roomCode);
                  }}
                  disabled={startCountdown}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
