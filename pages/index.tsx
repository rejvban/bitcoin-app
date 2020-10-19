import Head from 'next/head';
import axios from 'axios';
import { NextPage } from 'next';
import { MarketHero, Table } from '@bitcoin-app/components';
import { dataSorter, addFluctuatedTag } from '@bitcoin-app/utils';

// Types
import { MarketData, RawMarketData } from '@bitcoin-app/models';

/**
 * Represents the Home page, where we prefetch the data, in order to avoid the blank table on initial load of the page,
 * that prefetched that is then sent to the _app where the redux store is initialized with the data provided from
 * the "getStaticProps"
 *
 * @page
 */
const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Bitcoin App</title>
      </Head>
      <MarketHero />
      <Table />
    </>
  );
};

export const getStaticProps = async () => {
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

  return {
    props: {
      data,
      initialReduxState: { market: { data } },
    },
  };
};

export default Home;
