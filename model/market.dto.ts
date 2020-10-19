export type RawMarketData = {
  currency: string;
  high: number | null;
  latest_trade: number;
  weighted_price: number | null;
  bid: number;
  volume: number;
  ask: number;
  low: number | null;
  duration: number;
  close: number;
  avg: null;
  symbol: string;
  currency_volume: number;
};

export type MarketData = {
  _fluctuated: boolean;
} & RawMarketData;

export type PivotedMarketData = {
  [key in keyof Exclude<MarketData, '_fluctuated'>]: MarketData;
};

export type MarketState = {
  data: MarketData[];
};
