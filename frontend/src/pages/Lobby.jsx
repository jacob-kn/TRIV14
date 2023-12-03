import BgFlourish from "../components/BgFlourish";
import { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";

export default function () {
  const [players, setPlayers] = useState([
    {
      id: 1,
      name: "Alice",
    },
    {
      id: 2,
      name: "Bob",
    },
    {
      id: 3,
      name: "Charlie",
    },
    {
      id: 4,
      name: "Eve",
    },
    {
      id: 5,
      name: "Xander",
    },
    {
      id: 6,
      name: "Yvonne",
    },
    {
      id: 7,
      name: "Zane",
    },
  ]);

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
            players.map((player) => (
              <div key={player.id} className="w-1/3 text-white text-center py-1">
                <p>{player.name}</p>
              </div>
            ))
          ) : (
            <p>Loading...{/* Spinner? */}</p>
          )}

        </div>
      </div>
    </div>
  );
}
