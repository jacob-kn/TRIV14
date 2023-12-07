import BgFlourish from "./BgFlourish";
import Spinner from "./Spinner";

export default function Lobby({ players }) {
  return (
    <div className="min-h-fit pt-8 pb-16 mb-8">
      <BgFlourish className="min-h-screen" flourish="3" />
      <div className="flex flex-col flex gap-4 items-center justify-center">
        <div className="flex flex-col w-1/2 md:w-2/3 pb-8">
          <p className="text-white text-2xl mb-4 px-4 text-center">
            You're in!
          </p>
          <p className="text-white text-2xl mb-4 px-4 text-center">
            Waiting for host to start the game...
          </p>
        </div>
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
