import React from 'react';
import { twMerge } from 'tailwind-merge';

const IconButton = ({ type, children, onClick, isSubmit, className }) => {
  let buttonStyle = '';

  switch (type) {
    case 'primary':
      buttonStyle = 'bg-white text-bunker-100';
      break;
    case 'secondary':
      buttonStyle = 'bg-gray-500/50 text-white';
      break;
    default:
      buttonStyle = 'bg-white text-bunker-100';
  }

  const style = twMerge(
    'flex items-center justify-center p-2 rounded-lg font-semibold hover:opacity-80 transition-opacity',
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

export default IconButton;
