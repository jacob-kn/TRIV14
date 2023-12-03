import { useState } from "react";
import BgFlourish from "../components/BgFlourish";
import Button from "../components/Button";
import Input from "../components/Input";

export default function EnterQuiz() {
  const [room, setRoom] = useState("");

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
              value={room}
              placeholder="Name"
              onChange={(e) => {
                setRoom(e.target.value);
              }}
            />
          </div>
          <div className="w-1/4 flex items-center justify-center">
            <Button
              type="primary"
              className="shadow-lg"
              onClick={() => {
                console.log(room);
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
