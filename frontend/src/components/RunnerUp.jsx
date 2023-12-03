export default function RunnerUp(props) {
  return (
    <div className="h-fit flex flex-row bg-surface rounded-lg p-4">
      <div className="w-fit flex flex-col gap-2 justify-start text-center">
        <p className="font-bold text-lg">{props.rank}</p>
        <img
          src={props.avatar}
          alt="Avatar"
          className="h-12 w-12 self-center"
        />
        <p className="w-24 text-ellipsis overflow-hidden">{props.name}</p>
      </div>
      <div className="flex flex-col gap-2 px-8">
        <div className="flex flex-col md:justify-between gap-1">
          <p className="font-bold">Score</p>
          <p className="">{props.score}</p>
        </div>
        <div className="flex flex-col md:justify-between gap-1">
          <p className="font-bold">Correct Answers</p>
          <p className="">{props.correctAnswers}</p>
        </div>
      </div>
    </div>
  );
}
