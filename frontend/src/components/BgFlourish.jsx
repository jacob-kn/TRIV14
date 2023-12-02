const BgFlourish = ({ flourish }) => {
  switch (flourish) {
    case '1':
      return (
        <>
          <img
            src={process.env.PUBLIC_URL + `/flourishes/bg-circle.png`}
            className={`absolute -z-50 w-1/4 min-w-[200px] top-1/2 left-0 translate-y-[40%]`}
          />
          <img
            src={process.env.PUBLIC_URL + `/flourishes/bg-rect-1.png`}
            className={`absolute -z-50 w-1/4 scale-150 min-w-[200px] top-0 right-0 translate-x-[-20%] translate-y-[-40%]`}
          />
        </>
      );
      break;
    case '2':
      return (
        <>
          <img
            src={process.env.PUBLIC_URL + `/flourishes/bg-rect-2.png`}
            className={`absolute -z-50 w-1/4 scale-150 min-w-[200px] top-1/2 left-0 translate-x-[-20%] translate-y-[-30%]`}
          />
          <img
            src={process.env.PUBLIC_URL + `/flourishes/bg-triangle-1.png`}
            className={`absolute -z-50 w-1/4 min-w-[200px] top-1/2 right-0 translate-x-[20%] translate-y-[-50%]`}
          />
        </>
      );
      break;
    case '3':
      return (
        <>
          <img
            src={process.env.PUBLIC_URL + `/flourishes/bg-triangle-2.png`}
            className={`absolute -z-50 w-1/4 min-w-[200px] top-0 left-0 translate-x-[-20%] translate-y-[40%]`}
          />
          <img
            src={process.env.PUBLIC_URL + `/flourishes/bg-rect-3.png`}
            className={`absolute -z-50 w-1/4 scale-150 min-w-[200px] top-0 right-0 translate-x-[40%] translate-y-[80%]`}
          />
          <img
            src={process.env.PUBLIC_URL + `/flourishes/bg-circle.png`}
            className={`absolute -z-50 w-1/4 min-w-[200px] top-0 left-1/2 translate-x-[-50%] translate-y-[200%]`}
          />
        </>
      );
    default:
      return (
        <>
          <img
            src={process.env.PUBLIC_URL + `/flourishes/bg-circle.png`}
            className={`absolute -z-50 w-1/4 min-w-[200px] top-1/2 left-0 translate-y-[40%]`}
          />
          <img
            src={process.env.PUBLIC_URL + `/flourishes/bg-rect-1.png`}
            className={`absolute -z-50 w-1/4 scale-150 min-w-[200px] top-0 right-0 translate-x-[-20%] translate-y-[-40%]`}
          />
        </>
      );
  }
};

export default BgFlourish;
