import { AppProps } from 'next/app';
import { WithWebsocketSource, Layout } from '@bitcoin-app/components';
import { ToastContainer } from 'react-toastify';

// Redux
import { useStore } from '@bitcoin-app/redux';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

// Styles
import '@bitcoin-app/style/index';
import 'react-toastify/dist/ReactToastify.min.css';

/**
 * Custom _app component used to initialze pages. Read more on https://nextjs.org/docs/advanced-features/custom-app
 * Beside setting the custom layouts and initializing the Redux store, we're initilizing the persistance and hydrating
 * the redux store from localStorage.
 *
 */
const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  const store = useStore(pageProps.initialReduxState);

  const persistor = persistStore(store);

  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <WithWebsocketSource>
          <Layout />
          <Component {...pageProps} />
          <ToastContainer />
        </WithWebsocketSource>
      </PersistGate>
    </Provider>
  );
};

export default MyApp;
