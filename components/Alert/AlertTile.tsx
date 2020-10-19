// Redux
import { useDispatch } from 'react-redux';
import { deleteAlert } from '@bitcoin-app/redux/alert';
import { Alert } from '@bitcoin-app/models';

type AlertProps = {
  data: Alert;
};

/**
 * Renders the informational AlertTile
 *
 * @component
 * @param {Alert} data The alert which details are renered.
 */
export const AlertTile: React.FC<AlertProps> = ({ data }) => {
  const dispatch = useDispatch();

  return (
    <li className="col-span-1 bg-white rounded-lg shadow">
      <div className="w-full flex items-center justify-between p-6 space-x-6">
        <div className="flex-1 truncate">
          <div className="flex items-center space-x-3">
            <h3 className="text-gray-900 text-sm leading-5 font-medium truncate">
              {data.symbol}
            </h3>
            <span className="flex-shrink-0 inline-block px-2 py-0.5 text-teal-800 text-xs leading-4 font-medium bg-teal-100 rounded-full">
              Low: {data.condition?.low ?? 'N/A'}
              &nbsp; High: {data.condition?.high ?? 'N/A'}
            </span>
          </div>
          <p className="mt-3 text-gray-500 text-sm leading-5 truncate">
            id: {data.id}
          </p>
          <div className="mt-3 flex items-center space-x-3">
            <h3 className="text-gray-900 text-sm leading-5 font-medium truncate">
              Meta
            </h3>
            <p className="text-gray-900 text-sm leading-5 truncate">
              {data.meta}
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200">
        <div className="-mt-px flex">
          <div className="w-0 flex-1 flex border-r border-gray-200">
            <button
              onClick={() => dispatch(deleteAlert(data))}
              className="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm leading-5 text-gray-700 font-medium border border-transparent rounded-bl-lg hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 transition ease-in-out duration-150"
            >
              <span className="ml-3">Delete</span>
            </button>
          </div>
        </div>
      </div>
    </li>
  );
};
