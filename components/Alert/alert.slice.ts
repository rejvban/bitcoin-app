import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Alert, AlertState } from 'model/alerts.dto';
import { toast } from 'react-toastify';

const initialState: AlertState = {
  alerts: [],
};

/**
 * Represents the slice which is a utility for a tidy combination of the actions/action-creators/reducer and action type.
 * The main feature of th redux-toolkit is that it is integrated with immer, which allows you to write a mutational state changing code,
 * which will be transpiled to use Immer making it fully fool-proof.
 */
const alertSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    createAlert({ alerts }, action: PayloadAction<Alert>) {
      const { payload } = action;
      alerts.push(payload);
    },
    deleteAlert(state, action: PayloadAction<Alert>) {
      const {
        payload: { id: targetId },
      } = action;

      const filteredAlerts = state.alerts.filter(({ id }) => id !== targetId);
      state.alerts = filteredAlerts;
    },
    deleteAllAlerts({ alerts }) {
      alerts.length = 0;
    },
    triggerAlert(state, action: PayloadAction<Alert>) {
      const {
        payload: { id, symbol },
      } = action;

      toast.warn(`Alert for ${symbol} has been dispatched.`, {
        closeOnClick: true,
      });

      const newAlerts = state.alerts.map((alert) => {
        if (alert.id === id) {
          return {
            ...alert,
            seen: true,
          };
        }
        return alert;
      });

      state.alerts = newAlerts;
    },
  },
});

export const {
  createAlert,
  deleteAlert,
  deleteAllAlerts,
  triggerAlert,
} = alertSlice.actions;

export const alertReducer = alertSlice.reducer;
