import React, { useState, useEffect, useRef } from 'react';
import Button from './Button';
import IconButton from './IconButton';

import { TrashIcon } from '@heroicons/react/24/outline';

const DeleteButton = ({ message, onConfirm, anchor, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);

  let position = 'left-0';
  if (anchor === 'left') {
    position = 'right-0';
  }

  const handleConfirm = () => {
    onConfirm();
    setIsOpen(false);
  };

  const handleClickOutside = (event) => {
    if (popoverRef.current && !popoverRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className={className}>
      <div className="relative inline-block" ref={popoverRef}>
        <IconButton type="secondary" onClick={() => setIsOpen(true)}>
          <TrashIcon className="w-6 h-6" />
        </IconButton>
        {isOpen && (
          <div
            className={`absolute flex flex-col gap-2 p-4 justify-center items-center z-50 mt-2 bg-surface border border-haiti rounded-md shadow-lg ${position}`}
          >
            <p className="text-gray-100">{message}</p>
            <div className="flex justify-end">
              <Button type="tertiary" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="secondary" onClick={handleConfirm}>
                Confirm
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteButton;
