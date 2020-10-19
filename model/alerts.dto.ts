export type Alert = {
  id: string;
  symbol: string;
  condition: {
    low: number | null;
    high: number | null;
  };
  meta?: string;
  seen: boolean;
};

export type AlertState = {
  alerts: Alert[];
};
