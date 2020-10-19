import { useMemo } from 'react';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

import { rootReducer, RootState } from './rootReducer';

let store: ReturnType<typeof makeStore>;

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['notifications'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const makeStore = (initialState?: Partial<RootState>) => {
  return configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== 'production',
    preloadedState: initialState as any,
    middleware: getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  });
};

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./rootReducer', () => {
    const newRootReducer = persistReducer;
    store.replaceReducer(newRootReducer as any);
  });
}

export type AppDispatch = typeof store.dispatch;

export const initializeStore = (preloadedState?: Partial<RootState>) => {
  let _store = store ?? makeStore(preloadedState);

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = makeStore({
      ...store.getState(),
      ...preloadedState,
    });

    store = undefined;
  }

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store;
  // Create the store once in the client
  if (!store) store = _store;

  return _store;
};

export const useStore = (initialState: RootState) => {
  const store = useMemo(() => initializeStore(initialState), [initialState]);
  return store;
};
