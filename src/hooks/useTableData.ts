import { useState, useCallback, useEffect } from "react";
import { nanoid } from "nanoid";
import { debounce } from "lodash";

interface Column {
  header: string;
  accessorKey: string;
}

export const useTableData = (fileData: any) => {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const normalizeHeader = (header: string): string => {
    return header
      .toString()
      .trim()
      .replace(/[\s.()%$]/g, "_")
      .replace(/^_+|_+$/g, "")
      .toLowerCase();
  };

  const processValue = (value: string): string | number => {
    if (!value) return "";

    const cleanValue = value.toString().replace(/[$,]/g, "").trim();
    const numberValue = Number(cleanValue);

    return !isNaN(numberValue) ? numberValue : cleanValue;
  };

  const getUniqueAccessorKey = (
    header: string,
    index: number,
    existingKeys: Set<string>
  ): string => {
    let baseKey = header ? normalizeHeader(header) : `column_${index + 1}`;
    let accessorKey = baseKey;
    let counter = 1;

    while (existingKeys.has(accessorKey)) {
      accessorKey = `${baseKey}_${counter}`;
      counter++;
    }

    existingKeys.add(accessorKey);
    return accessorKey;
  };

  const processDataDebounced = debounce((fileData) => {
    try {
      const [headerRow, ...rows] = fileData.data;
      const existingKeys = new Set<string>();

      const tableColumns = headerRow.map((header: string, index: number) => {
        const trimmedHeader = (header || "").trim();
        return {
          header: trimmedHeader,
          accessorKey: getUniqueAccessorKey(trimmedHeader, index, existingKeys),
        };
      });

      const transformedData = rows.map((row: any[]) => {
        const rowData: any = { id: nanoid() };
        tableColumns.forEach((column, index) => {
          const rawValue = row[index];
          rowData[column.accessorKey] = processValue(rawValue);
        });
        return rowData;
      });

      setColumns(tableColumns);
      setData(transformedData);
    } catch (error) {
      console.error("Error processing CSV data:", error);
      setColumns([]);
      setData([]);
    } finally {
      setIsProcessing(false);
    }
  }, 300);

  useEffect(() => {
    if (!fileData?.data || fileData.data.length < 2) return;

    setIsProcessing(true);
    setData([]);
    setColumns([]);

    processDataDebounced(fileData);

    return () => {
      processDataDebounced.cancel();
    };
  }, [fileData]);

  const updateData = useCallback(
    (rowId: string, columnId: string, value: string) => {
      setData((prevData) =>
        prevData.map((row) => {
          if (row.id === rowId) {
            return {
              ...row,
              [columnId]: processValue(value),
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
    isProcessing,
  };
};
