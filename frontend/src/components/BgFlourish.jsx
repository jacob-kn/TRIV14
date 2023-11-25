const BgFlourish = ({ flourish }) => {
  let style = '';
  switch (flourish) {
    case '1':
      style = 'top-0 left-0 translate-x-[5%] translate-y-[-12%] scale-[1.1]';
      break;
    case '2':
      style =
        'top-1/2 left-1/2 translate-x-[-52%] translate-y-[-55%] scale-[1.3]';
      break;
    case '3':
      style =
        'top-1/2 left-1/2 translate-x-[-47%] translate-y-[-45%] scale-[1.25]';
      break;
    default:
      style = 'top-0 left-0';
  }

  return (
    <img
      src={process.env.PUBLIC_URL + `/flourishes/bg-flourish-${flourish}.png`}
      className={`absolute -z-50 ${style}`}
    />
  );
};

export default BgFlourish;
