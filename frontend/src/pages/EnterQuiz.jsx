import { useEffect, useState } from "react";
import BgFlourish from "../components/BgFlourish";
import Button from "../components/Button";
import Input from "../components/Input";
import { useParams } from "wouter";
import { navigate } from 'wouter/use-location';
import { socket } from "../socket";

export default function EnterQuiz() {
  const [userName, setUserName] = useState("");
  const { roomCode } = useParams();

  return (
    <div className="min-h-fit h-[75vh] mb-8">
      <BgFlourish flourish="3" />
      <div className="flex flex-col flex gap-4 items-center justify-center h-[50vh] px-8 m-w-fit">
        <h1 className="text-white text-3xl font-bold mb-4 px-4">
          Choose your name:
        </h1>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center px-4">
          <div className="w-3/4 flex items-center justify-center">
            <Input
              className="grow self-stretch mb-0"
              isLight
              type="text"
              value={userName}
              placeholder="Name"
              onChange={(e) => {
                setUserName(e.target.value);
              }}
            />
          </div>
          <div className="w-1/4 flex items-center justify-center">
            <Button
              type="primary"
              className="shadow-lg"
              onClick={() => {
                console.log("Entering as: " + userName);
                console.log("Joining room: " + roomCode);
                
                socket.emit('joinRoom', roomCode, userName);
                navigate("/play/" + roomCode);
              }}
            >
              Enter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
