import React, { useMemo, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

interface DataTableProps {
  data: any[];
  columns: any[];
  onUpdate: (rowId: string, columnId: string, value: string) => void;
}

export const DataTable: React.FC<DataTableProps> = ({
  data,
  columns,
  onUpdate,
}) => {
  const columnDefs = useMemo(
    () =>
      columns.map((col) => ({
        field: col.accessorKey,
        headerName: col.header,
        editable: true,
        sortable: true,
        filter: true,
        resizable: true,
        filterParams: {
          buttons: ["reset", "apply"],
          closeOnApply: true,
        },
      })),
    [columns]
  );

  const defaultColDef = useMemo(
    () => ({
      flex: 1,
      minWidth: 100,
      filterParams: {
        debounceMs: 200,
      },
    }),
    []
  );

  const onCellValueChanged = useCallback(
    (params: any) => {
      const { data: rowData, colDef, newValue } = params;
      onUpdate(rowData.id, colDef.field, newValue);
    },
    [onUpdate]
  );

  const gridOptions = useMemo(
    () => ({
      enableCellChangeFlash: true,
      cacheQuickFilter: true,
      animateRows: true,
      pagination: true,
      paginationPageSize: 100,
      suppressMovableColumns: false,
      suppressFieldDotNotation: true,
      // Performance options
      rowBuffer: 10,
      maxBlocksInCache: 5,
      maxConcurrentDatasourceRequests: 2,
      cacheBlockSize: 100,
      blockLoadDebounceMillis: 100,
    }),
    []
  );

  if (!data?.length) return null;

  return (
    <div className="ag-theme-alpine w-full h-[600px]">
      <AgGridReact
        rowData={data}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        onCellValueChanged={onCellValueChanged}
        gridOptions={gridOptions}
        rowSelection="multiple"
        enableCellTextSelection={true}
        ensureDomOrder={true}
      />
    </div>
  );
};

export default DataTable;
