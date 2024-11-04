import React, { useState, useCallback, useMemo } from "react";
import { FileUpload } from "./components/DataInput/FileUpload";
import { useFileData } from "./hooks/useFileData";
import { DataTable } from "./components/Table/DataTable";
import { useTableData } from "./hooks/useTableData";
import Chart from "./components/Chart/Chart";
import { ClipLoader } from "react-spinners";
import ChartConfiguration, {
  ChartConfig,
} from "./components/Chart/ChartConfiguration";
import Split from "react-split";
import logo from "./assets/ab-charts.png";

const App: React.FC = () => {
  const { data: fileData, error, processFile } = useFileData();
  const { data, columns, updateData, isProcessing } = useTableData(fileData);
  const [chartConfig, setChartConfig] = useState<ChartConfig>();
  const [hasFileBeenUploaded, setHasFileBeenUploaded] = useState(false);

  const handleFileSelect = useCallback(
    async (file: File) => {
      setHasFileBeenUploaded(true);
      processFile(file);
    },
    [processFile]
  );

  // Memoize content renders
  const chartContent = useMemo(() => {
    if (!hasFileBeenUploaded) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          Please upload a file to view the chart
        </div>
      );
    }

    if (isProcessing) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <ClipLoader color="#4B5563" size={40} />
          <div className="mt-4 text-gray-600">Processing data...</div>
        </div>
      );
    }

    if (data.length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          No data available
        </div>
      );
    }

    return <Chart data={data} config={chartConfig} />;
  }, [data, chartConfig, hasFileBeenUploaded, isProcessing]);

  const dataContent = useMemo(() => {
    if (!hasFileBeenUploaded) {
      return (
        <div className="flex items-center justify-center h-32 text-gray-500">
          Please upload a file to view the data
        </div>
      );
    }

    if (isProcessing) {
      return (
        <div className="flex flex-col items-center justify-center h-32">
          <ClipLoader color="#4B5563" size={40} />
          <div className="mt-4 text-gray-600">Processing data...</div>
        </div>
      );
    }

    if (data.length > 0 && columns.length > 0) {
      return (
        <div className="mt-4">
          <DataTable data={data} columns={columns} onUpdate={updateData} />
        </div>
      );
    }

    return null;
  }, [data, columns, updateData, hasFileBeenUploaded, isProcessing]);

  const configurationSection = useMemo(
    () => (
      <div>
        <ChartConfiguration
          data={data}
          columns={columns}
          isProcessing={isProcessing}
          onConfigChange={setChartConfig}
        />
      </div>
    ),
    [data, columns, isProcessing]
  );

  return (
    <div className="h-screen w-full bg-gray-50" data-theme="light">
      <Split
        direction="vertical"
        sizes={[70, 30]}
        minSize={100}
        className="h-full flex flex-col"
      >
        <Split className="flex" sizes={[75, 25]} minSize={200}>
          <div className="overflow-auto bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <img
              src={logo}
              alt="logo"
              className="h-14 w-14 object-cover rounded-full"
              title="logo"
            />
            <div className="h-[calc(100%-2rem)]">{chartContent}</div>
          </div>

          <div className="overflow-y-auto bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Chart Configuration</h2>
            {configurationSection}
          </div>
        </Split>

        <div className="overflow-auto bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Data Section</h2>
          <div className="w-full">
            <FileUpload onFileSelect={handleFileSelect} />
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">
                {error}
              </div>
            )}
            {dataContent}
          </div>
        </div>
      </Split>
    </div>
  );
};

export default App;
