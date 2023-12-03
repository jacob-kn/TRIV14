import BgFlourish from "../components/BgFlourish";
import Button from "../components/Button";
import { useState } from "react";

export default function HostLobby() {
  const roomCode = 123456;
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
      <BgFlourish flourish="3" />
      <div className="flex flex-col flex items-center justify-center">
        <div className="flex flex-col sm:w-1/2 md:w-2/3 pb-8 justify-center">
          <p className="text-white text-2xl mb-4 px-4 text-center">
            Start with the Room Code:
          </p>
          <p className="text-white text-3xl font-bold mb-4 px-4 text-center">
            {roomCode}
          </p>
          <div className="w-1/4 self-center flex items-center justify-center">
            <Button type="primary" className="shadow-lg">
              Enter
            </Button>
          </div>
        </div>
        <p className="text-white text-1xl mb-4 px-4 text-center">
          Players: {players.length}/20
        </p>
        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-start w-1/3">
          {players ? (
            players.map((player) => (
              <div key={player.id} className="w-1/3 text-white text-center py-2 px-2">
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
