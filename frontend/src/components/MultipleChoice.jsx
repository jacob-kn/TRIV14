import Answer from "./Answer";
import { useState, useEffect } from "react";

export default function MultipleChoice({
  options,
  score,
  userInput,
  isClickable,
}) {
  const [selectedButton, setSelectedButton] = useState(null);
  const handleSelect = (buttonId) => {
    setSelectedButton(buttonId);
    // Button logic here
    console.log(`Button ${buttonId} clicked`);
    userInput(options[buttonId].text);
  };

  return (
    <div className="flex flex-col md:flex-row justify-center w-full h-full px-4">
      <div className="flex flex-col items-center w-1/4">
        <div className="hidden md:block flex flex-col items-center justify-center bg-surface w-3/4 rounded-lg py-2">
          <h2 className="text-white p-2 font-bold md:text-xl text-center">
            Score
          </h2>
          <p className="text-white p-2 md:text-xl text-center">{score}</p>
        </div>
      </div>
      <div className="flex flex-col md:flex-row flex-wrap justify-center md:w-1/2 gap-4">
        {options.map((option, index) => {
          return (
            <Answer
              key={index}
              id={index}
              selected={selectedButton === index}
              onClick={handleSelect}
              clickable={!isClickable}
              className="md:w-2/5 h-12 md:h-24 bg-blue-600"
            >
              {option.text}
            </Answer>
          );
        })}
      </div>
      <div className="flex flex-col items-center m-w-fit md:w-1/4">
        <div className="flex flex-col justify-center bg-surface min-w-fit md:w-3/4 rounded-lg my-4 py-2">
          <h2 className="text-white p-2 font-bold md:text-xl text-center">
            Power-Ups
          </h2>
          <div className="flex flex-row md:flex-col gap-4 my-4 items-center justify-center">
            <div className="flex flex-row justify-center md:justify-start w-[150px]">
              <button
                onClick={() => {
                  console.log("x2 Points button clicked.");
                }}
                className="hover:scale-105 mx-2 rounded-full w-12 h-12 bg-[#20242B] shadow-md text-white flex justify-center items-center border-solid border-2 border-bunker-100"
              >
                <img
                  className="w-5 h-5"
                  src={process.env.PUBLIC_URL + `/chevron.svg`}
                />
              </button>
              <p className="text-white place-self-center">x2 Points</p>
            </div>
            <div className="flex flex-row justify-center md:justify-start w-[150px]">
              <button
                onClick={() => {
                  console.log("50/50 button clicked.");
                }}
                className="hover:scale-105 mx-2 rounded-full w-12 h-12 bg-[#20242B] shadow-md text-white flex justify-center items-center border-solid border-2 border-bunker-100"
              >
                <img
                  className="w-5 h-5"
                  src={process.env.PUBLIC_URL + `/chevron.svg`}
                />
              </button>
              <p className="text-white place-self-center">50/50</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
