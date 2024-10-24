import React from "react";
import { FileUpload } from "./components/DataInput/FileUpload";
import { useFileData } from "./hooks/useFileData";
import { DataTable } from "./components/Table/DataTable";
import { useTableData } from "./hooks/useTableData";

const App: React.FC = () => {
  const { data: fileData, error, processFile } = useFileData();
  const { data, columns, updateData } = useTableData(fileData);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Data Management</h1>
      <FileUpload onFileSelect={processFile} />
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      {data.length > 0 && columns.length > 0 && (
        <div className="mt-4">
          <DataTable data={data} columns={columns} onUpdate={updateData} />
        </div>
      )}
    </div>
  );
};

export default App;
