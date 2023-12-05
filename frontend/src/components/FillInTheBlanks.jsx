import { useState } from "react";
import BgFlourish from "./BgFlourish";
import CountdownBar from "./CountDownTimer";
import FillInTheBlank from "./FillInTheBlank";

export default function FillInTheBlanks({ title, question, options, score, submit }) {
  const [answer, setAnswer] = useState("");
  const totalSeconds = 60;

  const handleCountdownEnd = () => {
    console.log("Time is up!");
    // Timer = 0 logic here
    submit(answer);
  };

  const handleTextInput = (textInput) => {
    console.log("Text Input: " + textInput);
    setAnswer(textInput);
  }

  return (
    <div className="min-h-fit pb-16 mb-8">
      <BgFlourish flourish="3" />
      <div className="flex flex-col gap-4 items-center justify-center">
        <div className="flex flex-row items-center ">
          <div className="md:hidden flex flex-col items-center justify-center bg-surface w-fit rounded-lg">
            <h2 className="text-white p-2 font-bold md:text-xl">Score</h2>
            <p className="text-white p-2 md:text-xl text-center">{score}</p>
          </div>
          <h1 className="text-white text-2xl font-bold px-4">{title}</h1>
        </div>
        <CountdownBar
          totalSeconds={totalSeconds}
          onCountdownEnd={handleCountdownEnd}
        />
        <div>
          <h1 className="text-white text-2xl font-bold mb-4 px-4 text-center">
            {question}
          </h1>
        </div>

        <div className="flex flex-col md:flex-row justify-center w-full h-full px-4">
          <div className="flex flex-col items-center w-1/4">
            <div className="hidden md:block flex flex-col items-center justify-center bg-surface w-3/4 rounded-lg py-2">
              <h2 className="text-white p-2 font-bold md:text-xl text-center">
                Score
              </h2>
              <p className="text-white p-2 md:text-xl text-center">{score}</p>
            </div>
          </div>
          <div className="flex flex-col flex-wrap md:w-1/2 gap-4 items-start">
            {/* <FillInTheBlank paragraphText={customParagraph} /> */}
            {options.map((option, index) => {
              // console.log("options index: " + index + ", text: " + option.text);
              return <FillInTheBlank key={index} paragraphText={option.text} onTextChange={handleTextInput} />;
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
                <div className="flex flex-row justify-center md:justify-start w-[150px] opacity-50 pointer-events-none">
                  <button className="hover:scale-105 mx-2 rounded-full w-12 h-12 bg-[#20242B] shadow-md text-white flex justify-center items-center border-solid border-2 border-bunker-100">
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
      </div>
    </div>
  );
}
