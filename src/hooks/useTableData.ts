import { useState, useCallback, useEffect } from "react";
import { nanoid } from "nanoid";

export const useTableData = (fileData: any) => {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[]>([]);

  useEffect(() => {
    if (!fileData?.data || fileData.data.length < 2) return;

    const [headers, ...rows] = fileData.data;

    const transformedData = rows.map((row) => {
      const rowData: any = { id: nanoid() };
      headers.forEach((header: string, index: number) => {
        rowData[header.toLowerCase()] = row[index] || "";
      });
      return rowData;
    });

    const tableColumns = headers.map((header: string) => ({
      header: header,
      accessorKey: header.toLowerCase(),
    }));

    setData(transformedData);
    setColumns(tableColumns);
  }, [fileData]);

  const updateData = useCallback(
    (rowId: string, columnId: string, value: string) => {
      setData((old) =>
        old.map((row) => {
          if (row.id === rowId) {
            return {
              ...row,
              [columnId]: value,
            };
          }
          return row;
        })
      );
    },
    []
  );

  return {
    data,
    columns,
    updateData,
  };
};
