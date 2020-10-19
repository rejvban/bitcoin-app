import { useEffect } from 'react';
import axios from 'axios';
import {
  addFluctuatedTag,
  dataSorter,
  pivotData,
  raiseAlert,
} from '@bitcoin-app/utils';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { setMarket } from '@bitcoin-app/redux/market';
import { RootState } from '@bitcoin-app/redux';
import { triggerAlert } from '@bitcoin-app/redux/alert';

// Types
import type {
  MarketData,
  RawMarketData,
  PivotedMarketData,
} from '@bitcoin-app/models';

type Props = {
  children: React.ReactNode;
};

/**
 * Represents the HOC wrapper which inititates the websocket connection and feeds it to the Redux.
 *
 * @component
 * @param children {ReactNode[]}
 */
export const WithHttpSource: React.FC<Props> = ({ children }) => {
  const dispatch = useDispatch();

  const { alerts: reduxAlerts } = useSelector(
    (state: RootState) => state.notifications,
  );

  useEffect(() => {
    let pivotedMarketData: PivotedMarketData;
    const cleanup = () => {
      clearInterval(interval);
    };

    const interval = setInterval(async () => {
      const { data } = await axios.get<MarketData[]>(
        'http://api.bitcoincharts.com/v1/markets.json',
        {
          transformResponse: [
            (data) => {
              const parsedData = JSON.parse(data);
              return dataSorter<RawMarketData>(parsedData, 'volume');
            },
            (data) => {
              return addFluctuatedTag(data);
            },
          ],
        },
      );
      pivotedMarketData = pivotData<MarketData>(
        data,
        'symbol',
      ) as PivotedMarketData;

      const alertsToRaise = raiseAlert(reduxAlerts, pivotedMarketData);
      alertsToRaise.forEach((alert) => {
        if (!alert.seen) {
          dispatch(triggerAlert(alert));
        }
      });
      dispatch(setMarket(data));
    }, 5000);

    window.addEventListener('beforeunload', cleanup);

    return () => {
      window.removeEventListener('beforeunload', cleanup);
    };
  }, [dispatch, reduxAlerts]);

  return <>{children}</>;
};
