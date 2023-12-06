import { useParams } from "wouter";
import BgFlourish from "../components/BgFlourish";
import Button from "../components/Button";
import Spinner from "../components/Spinner";

export default function HostLobby({ players }) {
  const { roomCode } = useParams();

  const startQuiz = () => {
    console.log("Host is starting the quiz.");
  }

  return (
    <div className="min-h-fit pt-8 pb-16 mb-8">
      <BgFlourish flourish="3" />
      <div className="flex flex-col flex items-center justify-center">
        <div className="flex flex-col sm:w-1/2 md:w-2/3 pb-8 justify-center">
          <p className="text-white text-2xl mb-4 px-4 text-center">
            Start Quiz with the Room Code:
          </p>
          <p className="text-white text-3xl font-bold mb-4 px-4 text-center">
            {roomCode}
          </p>
          <div className="w-1/4 self-center flex items-center justify-center">
            <Button type="primary" className="shadow-lg" onClick={() => {
              startQuiz();
            }}>
              Enter
            </Button>
          </div>
        </div>
        <p className="text-white text-1xl mb-4 px-4 text-center">
          Players: {players.length}
        </p>
        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-start w-1/3">
          {players ? (
            players.map((player, index) => (
              <div key={index} className="w-1/3 text-white text-center py-1">
                <p>{player}</p>
              </div>
            ))
          ) : (
            <div className="self-center">
              <Spinner />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
