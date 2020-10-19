import { combineReducers } from '@reduxjs/toolkit';

// Reducers
import { alertReducer } from '@bitcoin-app/redux/alert';
import { marketReducer } from '@bitcoin-app/redux/market';

export const rootReducer = combineReducers({
  notifications: alertReducer,
  market: marketReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
