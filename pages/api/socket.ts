import Server from 'socket.io';
import axios from 'axios';
import { NextApiRequest } from 'next';
import { isEmpty } from 'lodash';
import {
  dataSorter,
  addFluctuatedTag,
  pivotData,
  checkIfChanged,
} from '@bitcoin-app/utils';

// Types
import type {
  RawMarketData,
  MarketData,
  PivotedMarketData,
} from '@bitcoin-app/models';

const ioHandler = (_: NextApiRequest, res) => {
  if (!res.socket.server.io) {
    const INTERVAL = 5000;

    const io = new Server(res.socket.server);

    io.on('connection', (socket) => {
      let intervalId: NodeJS.Timeout;
      let marketData: MarketData[] = [];
      let pivotedMarketData: PivotedMarketData;
      const room = io.sockets.adapter.rooms[`__DATA__`];

      socket.on('subscribe', () => {
        if (room === undefined) {
          socket.join(`__DATA__`);
          intervalId = setInterval(async () => {
            const { data } = await axios.get<MarketData[]>(
              'https://api.bitcoincharts.com/v1/markets.json',
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
            if (isEmpty(pivotedMarketData)) {
              pivotedMarketData = pivotData<MarketData>(
                data,
                'symbol',
              ) as PivotedMarketData;
            } else {
              marketData = checkIfChanged(pivotedMarketData, data);

              pivotedMarketData = pivotData<MarketData>(
                data,
                'symbol',
              ) as PivotedMarketData;
            }
            if (!isEmpty(marketData)) {
              io.in('__DATA__').emit('@MARKET_DATA', {
                data: marketData,
                pivotedData: pivotedMarketData,
              });
            }
          }, INTERVAL);
        } else {
          socket.join(`__DATA__`);
        }
      });

      socket.on('unsubscribe', () => {
        socket.leaveAll();
        clearInterval(intervalId);
      });
    });

    res.socket.server.io = io;
  } else {
    ('socket.io already running');
  }
  res.end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default ioHandler;
