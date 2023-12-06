import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "wouter";
import Input from "../components/Input";
import Button from "../components/Button";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import BgFlourish from "../components/BgFlourish";
import { socket } from '../socket';

function Main() {
  const [code, setCode] = useState("");
  const dispatch = useDispatch();

  const enterRoom = () => {
    if(socket){
      socket.emit('checkRoom', code);
    }else {
      console.log(socket);
    }
  }

  useEffect(() => {
    if (socket) {
        console.log('Socket is now available in Main.');
        // You can set up socket event listeners here
    }else {console.log('unavailable');}
  }, [socket]);

  const onChange = (e) => {
    setCode(e.target.value);
  };

  return (
    <>
      <BgFlourish flourish="1" />
      <div className="flex gap-16 items-center justify-center px-12 pb-24">
        <div className="relative w-2/3 max-w-3xl">
          <img
            src={process.env.PUBLIC_URL + "/flourishes/join-polygons.svg"}
            className="w-full -z-10"
          />
          <div className="w-1/2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-2/3">
            <h1 className="text-white text-3xl font-bold mb-4">Join quiz:</h1>
            <div className="flex gap-4 items-stretch">
              <Input
                className="grow self-stretch mb-0"
                isLight
                type="text"
                value={code}
                placeholder="Room code"
                onChange={onChange}
              />
              <Button type="primary" className="shadow-lg" onClick={() => {enterRoom()}}>
                Enter
              </Button>
            </div>
          </div>
        </div>
        <div className="relative flex flex-col gap-4 bg-surface w-1/3 max-w-sm rounded-xl p-10 mr-4">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300%] aspect-square bg-[radial-gradient(#EA50F820_0%,rgba(255,255,255,0.00)_50%)] -z-10"></div>
          <h2 className="text-white text-xl font-semibold text-center">
            Host a game
          </h2>
          <Link to="/register">
            <Button type="secondary" className="w-full whitespace-normal">
              Create quiz
              <ArrowRightIcon className="w-6 h-6" />
            </Button>
          </Link>
          <Link to="/quizzes">
            <Button
              type="secondary"
              className="w-full whitespace-normal"
              onClick={() => {}}
            >
              Explore quizzes
              <ArrowRightIcon className="w-6 h-6" />
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Main;
