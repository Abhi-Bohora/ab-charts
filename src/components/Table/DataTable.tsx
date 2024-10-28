import React, { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  SortingState,
  ColumnDef,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
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

  // Reference for the scrollable container
  const parentRef = React.useRef<HTMLDivElement>(null);

  // Memoize columns definition
  const tableColumns = useMemo<ColumnDef<any>[]>(
    () =>
      columns.map((col) => ({
        accessorKey: col.accessorKey,
        header: ({ column }: any) => {
          const sort = column.getIsSorted();
          return (
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => column.toggleSorting()}
            >
              <span>{col.header}</span>
              {sort &&
                (sort === "asc" ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                ))}
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

  // Memoize table instance
  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: false,
  });

  const { rows } = table.getRowModel();

  // Initialize virtualizer
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 45,
    overscan: 5, // Number of items to render outside the visible area
  });

  if (!data.length) return null;

  return (
    <div className="rounded-lg border border-gray-200">
      {/* Header table */}
      <div className="bg-gray-50 border-b border-gray-200">
        <table className="min-w-full">
          <thead>
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
        </table>
      </div>

      {/* Scrollable body */}
      <div
        ref={parentRef}
        className="overflow-auto"
        style={{
          height: "600px",
        }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index];
            return (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={rowVirtualizer.measureElement}
                className="absolute top-0 left-0 w-full hover:bg-gray-50"
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <div className="flex border-b border-gray-200">
                  {row.getVisibleCells().map((cell) => (
                    <div
                      key={cell.id}
                      className="flex-1 px-6 py-4 whitespace-nowrap"
                      style={{
                        width: cell.column.getSize(),
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DataTable;
