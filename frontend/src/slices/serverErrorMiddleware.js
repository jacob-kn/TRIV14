import { isRejectedWithValue } from '@reduxjs/toolkit';

export const serverErrorMiddleware = (api) => (next) => (action) => {
  if (isRejectedWithValue(action) && action.payload.originalStatus === 500) {
    if (navigator.onLine) {
      action.payload = {
        error: 'Could not connect to server',
      };
    } else {
      action.payload = {
        error: 'No internet connection',
      };
    }
  }

  return next(action);
};
