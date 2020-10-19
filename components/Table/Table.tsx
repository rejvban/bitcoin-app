import React, { useState } from 'react';
import { GridApi, ColumnApi } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';

// Redux
import { useSelector } from 'react-redux';

// Types
import type { RootState } from 'store/rootReducer';

// Styles
import 'ag-grid-community';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

/**
 * Table is representing one of the core feature of the application, I'm utillizing the aG-grid table beacause
 * the scratch implementation of the table is impossible in the given timeframe. At least the one with the features
 * that I had in mind.
 *
 * @component
 */
export const Table = () => {
  const { data: reduxMarket } = useSelector((state: RootState) => state.market);

  const [, setGridApi] = useState<GridApi>(null);
  const [, setGridColumnApi] = useState<ColumnApi>(null);

  const gridOptions = {
    columnDefs: [
      {
        headerName: 'Symbol',
        field: 'symbol',
        filter: 'agTextColumnFilter',
        enableCellChangeFlash: true,
      },
      {
        headerName: 'Volume',
        field: 'volume',
        sortable: true,
        cellRenderer: 'agAnimateShowChangeCellRenderer',
      },
      {
        headerName: 'High',
        field: 'high',
        sortable: true,
        cellRenderer: 'agAnimateShowChangeCellRenderer',
      },
      {
        headerName: 'Low',
        field: 'low',
        sortable: true,
        cellRenderer: 'agAnimateShowChangeCellRenderer',
      },
      {
        headerName: 'Currency',
        field: 'currency',
        filter: 'agTextColumnFilter',
      },
    ],
    defaultColDef: {
      headerClass:
        'px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider',
      cellClass:
        'px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 font-medium text-gray-900',
      autoHeight: true,
      enableCellChangeFlash: true,
      valueFormatter: ({ value }) => {
        return value ?? 'N/A';
      },
    },
    pagination: true,
    paginationPageSize: 20,
  };

  function onGridReady(params) {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  }

  return (
    <div
      className="flex flex-col ml-auto mr-auto mt-5 mb-10"
      style={{ width: '1200px' }}
    >
      <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div
          style={{ height: 600, width: '100%' }}
          className="ag-theme-alpine align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200"
        >
          <AgGridReact
            onGridReady={onGridReady}
            rowData={reduxMarket}
            animateRows={true}
            immutableData={true}
            getRowNodeId={(data) => data.symbol}
            onFirstDataRendered={(params) => params.api.sizeColumnsToFit()}
            enableCellChangeFlash={true}
            gridOptions={gridOptions}
          />
        </div>
      </div>
    </div>
  );
};
