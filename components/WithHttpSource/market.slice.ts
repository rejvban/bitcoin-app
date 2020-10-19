import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { MarketData, MarketState } from 'model';

const initialState: MarketState = {
  data: [],
};

const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    setMarket(state, action: PayloadAction<MarketData[]>) {
      const { payload } = action;
      state.data = payload;
    },
  },
});

export const { setMarket } = marketSlice.actions;

export const marketReducer = marketSlice.reducer;
