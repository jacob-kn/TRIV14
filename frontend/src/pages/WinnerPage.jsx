import BgFlourish from "../components/BgFlourish";
import RunnerUp from "../components/RunnerUp";

export default function WinnerPage({ scores }) {
  const mapArray = Array.from(scores.entries());
  mapArray.sort((a, b) => b[1] - a[1]);
  const sortedMap = new Map(mapArray);

  const valuesIterator = sortedMap.values();
  const first = valuesIterator.next().value;
  const second = valuesIterator.next().value;
  const third = valuesIterator.next().value;

  return (
    <div className="min-h-fit pb-20 flex justify-center text-white">
      <BgFlourish flourish="3" />
      <div className="md:w-3/4 flex flex-col md:flex-row items-center">
        <div className="w-full md:w-1/2 h-full p-8">
          <div className="py-4 flex flex-col rounded-lg text-center gap-4 bg-gradient-to-tr from-[#000004] via-[#0d0635] via-10% via-[#541f90] via-45% via-[#a44fcc] via-75% to-[#c476e9] to-95%">
            <p className="font-bold text-2xl">Winner!</p>
            <img
              src={process.env.PUBLIC_URL + `/avatars/avatar-1.svg`}
              alt="Avatar"
              className="h-24 w-24 self-center"
            />
            <p className="">Alice</p>
            <div className="flex flex-row justify-between text-left gap-2">
              <p className="pl-8 w-2/3">Score</p>
              <p className="w-1/3">3</p>
            </div>
            <div className="flex flex-row justify-between text-left gap-2">
              <p className="pl-8 w-2/3"></p>
              <p className="w-1/3"></p>
            </div>
            <div className="flex flex-row justify-between text-left gap-2">
              <p className="pl-8 w-2/3"></p>
              <p className="w-1/3"></p>
            </div>
            <div className="flex flex-row justify-between text-left gap-2">
              <p className="pl-8 w-2/3"></p>
              <p className="w-1/3"></p>
            </div>
          </div>
        </div>
        <div className="md:w-1/2 flex flex-col h-full p-8 gap-8">
          <RunnerUp
            rank="2nd"
            name="Bob"
            avatar={process.env.PUBLIC_URL + `/avatars/avatar-2.svg`}
            score="0"
            correctAnswers="18"
          />
          <RunnerUp
            rank="3rd"
            name="Charlie"
            avatar={process.env.PUBLIC_URL + `/avatars/avatar-3.svg`}
            score="0"
            correctAnswers="18"
          />
        </div>
      </div>
    </div>
  );
}
