import Head from 'next/head';
import { NextPage } from 'next';
import { AlertTile, MakeAlert } from '@bitcoin-app/components';

// Redux
import { RootState } from '@bitcoin-app/redux';
import { useSelector } from 'react-redux';

/**
 * Represents the Alert page, where we list all of our alerts kept in redux which is rehydrated from the localStorage,
 * making the alerts persisntat through tabs/pages.
 *
 * @page
 */
const Alerts: NextPage = () => {
  const { alerts: reduxAlerts } = useSelector(
    (state: RootState) => state.notifications,
  );

  return (
    <>
      <Head>
        <title>Bitcoin App | Alerts</title>
      </Head>
      <div className="p-10">
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 ">
          <MakeAlert />
          {reduxAlerts.map((alert) => (
            <AlertTile key={alert.id} data={alert} />
          ))}
        </ul>
      </div>
    </>
  );
};

export default Alerts;
