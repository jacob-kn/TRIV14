import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';

import {
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';

const Input = ({
  type,
  label,
  name,
  value,
  placeholder,
  onChange,
  isLight,
  className,
  children,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const renderInput = () => {
    const inputStyle = isLight
      ? 'bg-white text-bunker-100 placeholder-gray-500'
      : 'bg-gray-700 text-white placeholder-gray-400';
    switch (type) {
      case 'email':
        return (
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <EnvelopeIcon className="h-6 w-6 stroke-gray-400" />
            </span>
            <input
              type="email"
              name={name}
              className={`border border-gray-600 ${inputStyle} text-sm rounded-lg block h-full w-full ps-10 p-2.5 focus:ring-blue-500 focus:border-blue-500`}
              value={value}
              placeholder={placeholder}
              onChange={onChange}
            />
          </div>
        );
      case 'password':
        return (
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name={name}
              className={`border border-gray-600 ${inputStyle} text-sm rounded-lg block h-full w-full px-4 py-2.5 focus:ring-blue-500 focus:border-blue-500`}
              value={value}
              placeholder={placeholder}
              onChange={onChange}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={handleTogglePassword}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-6 w-6 stroke-gray-400" />
              ) : (
                <EyeIcon className="h-6 w-6 stroke-gray-400" />
              )}
            </button>
          </div>
        );
      case 'text':
        return (
          <input
            type="text"
            name={name}
            className={`border border-gray-600 ${inputStyle} text-sm rounded-lg block h-full w-full px-4 py-2.5 focus:ring-blue-500 focus:border-blue-500`}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
          />
        );
      case 'radio':
        return (
          <input
            type="radio"
            name={name}
            className="form-radio"
            value={value}
            onChange={onChange}
          />
        );
      case 'dropdown':
        return (
          <select className="form-select" value={value} onChange={onChange}>
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {children}
          </select>
        );
      default:
        return null;
    }
  };

  const style = twMerge('mb-5 flex flex-col justify-stretch', className);

  return (
    <div className={style}>
      {label && (
        <label className="block mb-2 font-medium text-white">{label}</label>
      )}
      {renderInput()}
    </div>
  );
};

export default Input;
