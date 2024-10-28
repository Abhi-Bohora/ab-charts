import React, { useMemo } from "react";
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
      })),
    [columns]
  );

  const defaultColDef = useMemo(
    () => ({
      flex: 1,
      minWidth: 100,
    }),
    []
  );

  const onCellValueChanged = (params: any) => {
    const { data: rowData, colDef, newValue } = params;
    onUpdate(rowData.id, colDef.field, newValue);
  };

  if (!data.length) return null;

  return (
    <div className="ag-theme-alpine w-full h-[600px]">
      <AgGridReact
        rowData={data}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        onCellValueChanged={onCellValueChanged}
        animateRows={true}
        rowSelection="multiple"
        pagination={true}
        paginationPageSize={100}
        enableCellChangeFlash={true}
        suppressMovableColumns={false}
        suppressFieldDotNotation={true}
      />
    </div>
  );
};

export default DataTable;
