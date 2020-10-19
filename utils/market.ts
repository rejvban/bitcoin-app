import { isEqual } from 'lodash';

// Types
import type {
  MarketData,
  PivotedMarketData,
  RawMarketData,
  Alert,
} from '@bitcoin-app/models';

/**
 * Takes the market data and sorts them by one of the numeric keys in the given order.
 * @param data Array of market data to be sorted.
 * @param key One of the numeric properties that the MarketData type has.
 * @param order The order of ascending or descending.
 */
export const dataSorter = <K>(
  data: K[],
  key: keyof K,
  order: 'asc' | 'desc' = 'desc',
) => {
  return data.sort((a, b) =>
    order === 'asc'
      ? a[key as string] - b[key as string]
      : b[key as string] - a[key as string],
  );
};

/**
 * Sets the initial "_fluctuated" property, used as an AxiosResponse transformer.
 * @param data The MarketData in which we will add the "_fluctuated property".
 */
export const addFluctuatedTag = (data: RawMarketData[]): MarketData[] => {
  return data.map((i) => ({ ...i, _fluctuated: false }));
};

/**
 * Takes the data and pivots it to the hashmap, done to increase the performance
 * when checking for data changes in between the socket feed.
 * @param data The data which is pivoted to the hashmap.
 * @param key The key wchih will hold the object.
 */
export const pivotData = <
  T extends Record<string, string | number | symbol | boolean>
>(
  data: T[],
  key: keyof T,
) => {
  const initial: Record<string | number | symbol, T> = {};

  return data.reduce((acc, cur) => {
    const curKey = cur[key];
    acc[curKey as any] = cur;
    return acc;
  }, initial);
};

/**
 * Checks for any changes in the data and sets "_fluctuated" tag acordingly.
 * @param oldData The pivoted data type of the MarketData.
 * @param newData The data which we are checking.
 */
export const checkIfChanged = (
  oldData: PivotedMarketData,
  newData: MarketData[],
) => {
  return newData.map(
    (data): MarketData => {
      const diff = isEqual(oldData[data.symbol], data);

      return {
        ...data,
        _fluctuated: !diff,
      };
    },
  );
};

/**
 * Returns the sattisfied alerts array.
 *
 * @param alerts The alerts state from redux.
 * @param data Pivoted data from the websocket feed.
 * @returns Alert[]
 */
export const raiseAlert = (alerts: Alert[], data: PivotedMarketData) => {
  return alerts.filter((alert) => {
    const inPivotedData: MarketData = data[alert.symbol];

    const alertHigh = alert.condition.high ?? Number.MAX_VALUE;
    const alertLow = alert.condition.low ?? Number.MIN_VALUE;

    const conditionLow = inPivotedData.low <= alertLow;
    const conditionHigh = inPivotedData.high >= alertHigh;

    const shouldRaise = conditionLow || conditionHigh;

    if (shouldRaise && !alert.seen) {
      return alert;
    }
  });
};
