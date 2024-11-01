import React, { useEffect, useState } from "react";
import { FileUpload } from "./components/DataInput/FileUpload";
import { useFileData } from "./hooks/useFileData";
import { DataTable } from "./components/Table/DataTable";
import { useTableData } from "./hooks/useTableData";
import Chart from "./components/Chart/Chart";
import { ClipLoader } from "react-spinners";
import Split from "react-split";
import logo from "./assets/ab-charts.png";
interface ChartConfig {
  xAxis: string;
  series: string[];
  title?: string;
  chartType?: "line" | "bar";
  smooth?: boolean;
  stack?: boolean;
  area?: boolean;
}

const App: React.FC = () => {
  const { data: fileData, error, processFile } = useFileData();
  const { data, columns, updateData, isProcessing } = useTableData(fileData);
  const [chartConfig, setChartConfig] = useState<ChartConfig | undefined>();
  const [hasFileBeenUploaded, setHasFileBeenUploaded] = useState(false);

  const handleFileSelect = async (file: File) => {
    setHasFileBeenUploaded(true);
    processFile(file);
  };

  const detectChartConfig = (data: any[]) => {
    if (!data.length || !columns.length) return;

    const numericColumns = columns.filter(
      (col) => typeof data[0][col.accessorKey] === "number"
    );

    const config: ChartConfig = {
      xAxis: columns[0].accessorKey,
      series: numericColumns.slice(0, 5).map((col) => col.accessorKey),
      title: "Data Visualization",
      chartType: "line",
      smooth: true,
      area: true,
    };

    setChartConfig(config);
  };

  useEffect(() => {
    if (!isProcessing && data.length > 0) {
      detectChartConfig(data);
    }
  }, [data, columns, isProcessing]);

  const renderChartContent = () => {
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
  };

  const renderDataContent = () => {
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
  };

  return (
    <div className="h-screen w-full bg-gray-50" data-theme="light">
      <Split
        direction="vertical"
        sizes={[70, 30]}
        minSize={100}
        className="h-full flex flex-col"
      >
        <Split className="flex" sizes={[75, 25]} minSize={200}>
          {/* Chart Section */}
          <div className="overflow-auto bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <img
              src={logo}
              alt="logo"
              className="h-14 w-14 object-cover rounded-full"
              title="logo"
            />
            <div className="h-[calc(100%-2rem)]">{renderChartContent()}</div>
          </div>

          {/* Chart Configuration Section */}
          <div className="overflow-y-auto bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Chart Configuration</h2>
            <div>
              <label className="label">Chart Title</label>
              <input
                type="text"
                className="input input-success w-full max-w-xs"
                value={chartConfig?.title || ""}
                onChange={(e) =>
                  setChartConfig((prev) => ({
                    ...prev!,
                    title: e.target.value,
                  }))
                }
              />
            </div>
            {columns.length > 0 && (
              <div className="space-y-4">
                <div>
                  <label className="label">X-Axis</label>
                  <select
                    className="select select-success w-full max-w-xs"
                    value={chartConfig?.xAxis}
                    onChange={(e) =>
                      setChartConfig((prev) => ({
                        ...prev!,
                        xAxis: e.target.value,
                      }))
                    }
                  >
                    {columns.map((col) => (
                      <option key={col.accessorKey} value={col.accessorKey}>
                        {col.header}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Chart Type</label>
                  <select
                    className="select select-success w-full max-w-xs"
                    value={chartConfig?.chartType}
                    onChange={(e) =>
                      setChartConfig((prev) => ({
                        ...prev!,
                        chartType: e.target.value as "line" | "bar",
                      }))
                    }
                  >
                    <option value="line">Line</option>
                    <option value="bar">Bar</option>
                  </select>
                </div>

                <div className="form-control">
                  {["smooth", "stack", "area"].map((option) => (
                    <label key={option} className="label cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(
                          chartConfig?.[option as keyof ChartConfig]
                        )}
                        onChange={(e) =>
                          setChartConfig((prev) => ({
                            ...prev!,
                            [option]: e.target.checked,
                          }))
                        }
                        className="checkbox checkbox-success"
                      />
                      <span className="label-text">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Split>

        {/* Bottom section for data table */}
        <div className="overflow-auto bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Data Section</h2>
          <div className="w-full">
            <FileUpload onFileSelect={handleFileSelect} />
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">
                {error}
              </div>
            )}
            {renderDataContent()}
          </div>
        </div>
      </Split>
    </div>
  );
};

export default App;
