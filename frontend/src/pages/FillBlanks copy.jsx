import Input from "../components/Input";
import Button from "../components/Button";
import BgFlourish from "../components/BgFlourish";
import CountdownBar from "../components/CountDownTimer";
import Answer from "../components/Answer";
import { useState } from "react";
import FillInTheBlank from "../components/FillInTheBlank";

export default function FillBlanks() {
  const totalSeconds = 60;
  const customParagraph = 'The quick brown _ jumps over the lazy dog.';

  const handleSelect = (answer) => {
    console.log(answer);
  };

  return (
    <div className="h-[75vh]">
      <BgFlourish flourish="3" />
      <div className="flex flex-col gap-4 items-center justify-center">
        <CountdownBar totalSeconds={totalSeconds} />
        <div>
          <h1 className="text-white text-3xl font-bold mb-4">Question</h1>
        </div>

        <div className="flex flex-row justify-center w-full h-full">
          <div className="flex flex-col items-center w-1/4">
            <div className="flex flex-col items-center justify-center bg-surface w-3/4 rounded-lg py-2">
              <h2 className="text-white p-2 font-bold md:text-xl">Score</h2>
              <p className="text-white p-2 md:text-xl">12345</p>
            </div>
          </div>
          <div className="flex flex-row flex-wrap justify-center w-1/2 gap-4">
            <FillInTheBlank paragraphText={ customParagraph }/>
          </div>
          <div className="flex flex-col items-center w-1/4">
            <div className="flex flex-col justify-center bg-surface w-3/4 rounded-lg py-2">
              <h2 className="text-white p-2 font-bold md:text-xl text-center">
                Power-Ups
              </h2>
              <div className="flex flex-col gap-4 my-4">
                <div className="flex flex-row justify-start">
                  <button className="hover:scale-105 mx-2 rounded-full w-12 h-12 bg-[#20242B] shadow-md text-white flex justify-center items-center border-solid border-2 border-bunker-100">
                    <img
                      className="w-5 h-5"
                      src={process.env.PUBLIC_URL + `/chevron.svg`}
                    />
                  </button>
                  <p className="text-white place-self-center md:text-xl">x2 Points</p>
                </div>
                <div className="flex flex-row justify-start">
                  <button className="hover:scale-105 mx-2 rounded-full w-12 h-12 bg-[#20242B] shadow-md text-white flex justify-center items-center border-solid border-2 border-bunker-100">
                    <img
                      className="w-5 h-5"
                      src={process.env.PUBLIC_URL + `/chevron.svg`}
                    />
                  </button>
                  <p className="text-white place-self-center md:text-xl">50 / 50</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
