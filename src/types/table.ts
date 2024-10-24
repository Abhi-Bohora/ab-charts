export type DataRow = {
  [key: string]: string;
  id: string;
};

export type ColumnDef = {
  header: string;
  accessorKey: string;
};
