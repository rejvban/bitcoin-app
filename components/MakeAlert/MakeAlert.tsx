import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { createAlert } from '@bitcoin-app/redux/alert';
import { RootState } from '@bitcoin-app/redux';

/**
 * Component dedicated to creating Alerts
 *
 * @component
 */
export const MakeAlert: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);

  return (
    <>
      <li
        onClick={handleOpen}
        className="transition duration-500 ease-in-out col-span-1 bg-white rounded-lg shadow hover:bg-gray-100 cursor-pointer"
      >
        <div className="w-full h-full flex items-center justify-center p-6 space-x-6 ">
          <svg
            className="w-8 h-8 text-gray-500"
            version="1.1"
            id="Layer_1"
            x="0px"
            y="0px"
            viewBox="0 0 330 330"
            fill="currentColor"
          >
            <path
              id="XMLID_87_"
              d="M315,120H210V15c0-8.284-6.716-15-15-15h-60c-8.284,0-15,6.716-15,15v105H15c-8.284,0-15,6.716-15,15v60
	c0,8.284,6.716,15,15,15h105v105c0,8.284,6.716,15,15,15h60c8.284,0,15-6.716,15-15V210h105c8.284,0,15-6.716,15-15v-60
	C330,126.716,323.284,120,315,120z"
            />
          </svg>
        </div>
      </li>
      <Modal open={open} onClose={() => setOpen(false)} />
    </>
  );
};

type ModalProps = {
  open: boolean;
  onClose: () => void;
};

type FormData = {
  symbol: string;
  high?: number | '';
  low?: number | '';
  meta?: string;
};

/**
 * Classic in-component modal for creating the alert. This is all statically typed because there is no other usecase.
 *
 * @param {boolean} open State of the Modal
 * @param {onClose} onClose Function for closing the Moda.
 */
export const Modal: React.FC<ModalProps> = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { data: reduxMarket } = useSelector((state: RootState) => state.market);

  const symbolOptions = useMemo(() => reduxMarket.map((i) => i.symbol), [
    reduxMarket,
  ]);

  const { register, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      symbol: 'coinsbankGBP',
      high: 0,
      low: 0,
      meta: '',
    },
  });

  const onSubmit = handleSubmit((data) => {
    const { symbol, high, low, meta } = data;

    dispatch(
      createAlert({
        id: uuidv4(),
        symbol,
        condition: {
          high: high === '' ? null : high,
          low: low === '' ? null : low,
        },
        meta,
        seen: false,
      }),
    );
    reset({});
    onClose();
  });

  return (
    open && (
      <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
          &#8203;
          <div
            className="p-5 inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <div className="md:col-span-1 mb-5">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Creating an alert notifiaction
              </h3>
              <p className="mt-1 text-sm leading-5 text-gray-500">
                By creating an alert you are subscribing to a specific Symbol,
                and will be notified when it reaches desired high/low.
              </p>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <form onSubmit={onSubmit}>
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="symbol"
                      className="block text-sm font-medium leading-5 text-gray-700"
                    >
                      Symbol
                    </label>
                    <select
                      id="symbol"
                      name="symbol"
                      className="mt-1 block form-select w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                      ref={register({ required: 'Required' })}
                    >
                      {symbolOptions.map((symbol) => (
                        <option key={symbol}>{symbol}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-6 sm:col-span-3"></div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="low"
                      className="block text-sm font-medium leading-5 text-gray-700"
                    >
                      Low
                    </label>
                    <input
                      type="number"
                      id="low"
                      name="low"
                      ref={register()}
                      className="mt-1 form-input block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="high"
                      className="block text-sm font-medium leading-5 text-gray-700"
                    >
                      High
                    </label>
                    <input
                      type="number"
                      id="high"
                      name="high"
                      ref={register()}
                      className="mt-1 form-input block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                    />
                  </div>

                  <div className="col-span-12 sm:col-span-6">
                    <label
                      htmlFor="meta"
                      className="block text-sm leading-5 font-medium text-gray-700"
                    >
                      Meta
                    </label>
                    <div className="rounded-md shadow-sm">
                      <textarea
                        id="meta"
                        name="meta"
                        ref={register()}
                        rows={3}
                        className="form-textarea mt-1 block w-full p-2 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                        placeholder="Description of alert"
                      ></textarea>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Metadata about the alert you&apos;re creating.
                    </p>
                  </div>
                </div>
                <div className="col-span-12 sm:col-span-6">
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
                      <button
                        type="submit"
                        className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-orange-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-orange-500 focus:outline-none focus:border-red-700 focus:shadow-outline-red transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                      >
                        Create
                      </button>
                    </span>
                    <span className="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
                      <button
                        type="button"
                        className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                        onClick={onClose}
                      >
                        Cancel
                      </button>
                    </span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  );
};
