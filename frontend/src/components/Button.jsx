import React from 'react';
import { twMerge } from 'tailwind-merge';

const Button = ({ type, children, onClick, isSubmit, className }) => {
  let buttonStyle = '';

  switch (type) {
    case 'primary':
      buttonStyle = 'bg-white text-bunker-100';
      break;
    case 'secondary':
      buttonStyle = 'bg-royal-blue text-white';
      break;
    case 'tertiary':
      buttonStyle = 'bg-transparent text-white';
      break;
    default:
      buttonStyle = 'bg-white text-bunker-100';
  }

  const style = twMerge(
    'flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-semibold whitespace-nowrap hover:scale-[1.03]',
    buttonStyle,
    className
  );

  return (
    <button
      className={style}
      onClick={onClick}
      type={isSubmit ? 'submit' : 'button'}
    >
      {children}
    </button>
  );
};

export default Button;
