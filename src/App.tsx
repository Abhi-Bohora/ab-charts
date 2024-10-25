import React from "react";
import { FileUpload } from "./components/DataInput/FileUpload";
import { useFileData } from "./hooks/useFileData";
import { DataTable } from "./components/Table/DataTable";
import { useTableData } from "./hooks/useTableData";
import Chart from "./components/Chart/Chart";

import Split from "react-split";

const App: React.FC = () => {
  const { data: fileData, error, processFile } = useFileData();
  const { data, columns, updateData } = useTableData(fileData);
  console.log(data);

  return (
    <div className="h-screen w-full bg-gray-50">
      <Split
        direction="vertical"
        sizes={[70, 30]}
        minSize={100}
        className="h-full flex flex-col"
      >
        {/* Top section with chart and config */}
        <Split className="flex" sizes={[75, 25]} minSize={200}>
          {/* Chart Section */}
          <div className="overflow-auto bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Chart Section</h2>
            <div className="h-full w-full">
              <Chart />
            </div>
          </div>

          {/* Chart Configuration Section */}
          <div className="overflow-y-auto bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Chart Configuration</h2>
            <div className="space-y-4">
              {/* Configuration options will go here */}
            </div>
          </div>
        </Split>

        {/* Bottom section for data table */}
        <div className="overflow-auto bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Data Section</h2>
          <div className="w-full">
            <FileUpload onFileSelect={processFile} />
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">
                {error}
              </div>
            )}
            {data.length > 0 && columns.length > 0 && (
              <div className="mt-4">
                <DataTable
                  data={data}
                  columns={columns}
                  onUpdate={updateData}
                />
              </div>
            )}
          </div>
        </div>
      </Split>
    </div>
  );
};

export default App;
