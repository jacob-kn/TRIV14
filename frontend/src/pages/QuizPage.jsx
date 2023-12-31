import BgFlourish from "../components/BgFlourish";
import CountdownBar from "../components/CountDownTimer";
import { useEffect, useRef, useState } from "react";
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
  const [isComplete, setIsComplete] = useState(false);
  const [quizQuestion, setQuizQuestion] = useState();
  const [isClickable, setIsClickable] = useState(true);
  const [players, setPlayers] = useState([]);
  const duration = 15;
  const [startCountdown, setStartCountdown] = useState(false);
  const [score, setScore] = useState(0);


  // use quiz id after joining a room to query and get
  const { data: user, isLoading } = useGetUserQuery();

  // details for the winner

  useEffect(() => {
    socket.on("updatedUserList", (playerArray) => {
      setPlayers(playerArray);
    });

    socket.on('newQuestion', (questionObject) => {
      setQuizQuestion(questionObject);
      setStartCountdown(true);
      setIsClickable(true);
      setIsStarted(true);
    });

    socket.on('correctAnswer', (correctOption) => {
      setStartCountdown(false);
    })

    socket.on('updateScore', (questionScore) => {
      console.log("Updating Scores");
      console.log(questionScore);
      setScore(score + questionScore);
    })

    socket.on('quizEnded', (scores) => {
      setScore(scores);
      console.log("Quiz ended. Logging scores");
      console.log(score);
      
      // socket.emit('socketToUser', scores, roomCode);
      setIsComplete(true);
    })

    socket.on('finalScores', (userScores) => {
      setScore(userScores);
      console.log(score);
    })

    return () => {
      socket.off("updatedUserList", () => {});
      socket.off('newQuestion', () => {});
    };
  }, [socket]);

  const handleUserInput = (ans) => {
    socket.emit('submitAnswer', ans, roomCode); //Todo - error
    setIsClickable(false);
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
        <WinnerPage scores={score}/>
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
            totalSeconds={duration}
            // onCountdownEnd={handleCountdownEnd}
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
                  isClickable={isClickable}
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
