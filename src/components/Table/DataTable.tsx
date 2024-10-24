import React, { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  SortingState,
} from "@tanstack/react-table";
import { ChevronUp, ChevronDown } from "lucide-react";
import { EditableCell } from "./EditableCell";

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
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const tableColumns = useMemo(
    () =>
      columns.map((col) => ({
        accessorKey: col.accessorKey,
        header: ({ column }: any) => {
          return (
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => column.toggleSorting()}
            >
              <span>{col.header}</span>
              {column.getIsSorted() === "asc" ? (
                <ChevronUp className="w-4 h-4" />
              ) : column.getIsSorted() === "desc" ? (
                <ChevronDown className="w-4 h-4" />
              ) : null}
            </div>
          );
        },
        cell: ({ cell, row, column }: any) => (
          <EditableCell
            cell={cell}
            row={row.original}
            column={column}
            onUpdate={onUpdate}
          />
        ),
      })),
    [columns, onUpdate]
  );

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (!data.length) return null;

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
