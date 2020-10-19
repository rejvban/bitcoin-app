import { useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { setMarket } from '@bitcoin-app/redux/market';
import { raiseAlert } from '@bitcoin-app/utils';
import { RootState } from '@bitcoin-app/redux';
import { triggerAlert } from '@bitcoin-app/redux/alert';

type Props = {
  children: React.ReactNode;
};

/**
 * Represents the HOC wrapper which inititates the websocket connection and feeds it to the Redux.
 *
 * @component
 * @param children {ReactNode[]}
 */
export const WithWebsocketSource: React.FC<Props> = ({ children }) => {
  const dispatch = useDispatch();

  const { alerts: reduxAlerts } = useSelector(
    (state: RootState) => state.notifications,
  );

  useEffect(() => {
    let socket: SocketIOClient.Socket;

    const cleanup = () => {
      socket.emit('unsubscribe');
      socket.disconnect();
    };

    axios.get('/api/socket').finally(() => {
      socket = io();

      socket.on('connect', () => {
        socket.emit('subscribe');
      });

      socket.on('@MARKET_DATA', ({ data, pivotedData }) => {
        const alertsToRaise = raiseAlert(reduxAlerts, pivotedData);
        alertsToRaise.forEach((alert) => {
          if (!alert.seen) {
            dispatch(triggerAlert(alert));
          }
        });
        dispatch(setMarket(data));
      });
    });

    window.addEventListener('beforeunload', cleanup);

    return () => {
      window.removeEventListener('beforeunload', cleanup);
    };
  }, [dispatch, reduxAlerts]);

  return <>{children}</>;
};
