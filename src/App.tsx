import React from "react";
import { FileUpload } from "./components/DataInput/FileUpload";
import { useFileData } from "./hooks/useFileData";
import { DataTable } from "./components/Table/DataTable";
import { useTableData } from "./hooks/useTableData";
import { useState } from "react";
import Chart from "./components/Chart/Chart";

import Split from "react-split";
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
  const { data, columns, updateData } = useTableData(fileData);
  const [chartConfig, setChartConfig] = useState<ChartConfig | undefined>();
  console.log(data);
  console.log(columns);

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

  React.useEffect(() => {
    detectChartConfig(data);
  }, [data]);

  return (
    <div className="h-screen w-full bg-gray-50">
      <Split
        direction="vertical"
        sizes={[70, 30]}
        minSize={100}
        className="h-full flex flex-col"
      >
        <Split className="flex" sizes={[75, 25]} minSize={200}>
          {/* Chart Section */}
          <div className="overflow-auto bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Chart Section</h2>
            <div className="h-[calc(100%-2rem)]">
              <Chart data={data} config={chartConfig} />
            </div>
          </div>

          {/* Chart Configuration Section */}
          <div className="overflow-y-auto bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Chart Configuration</h2>
            {columns.length > 0 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    X-Axis
                  </label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                  <label className="block text-sm font-medium text-gray-700">
                    Chart Type
                  </label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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

                <div className="space-y-2">
                  {["smooth", "stack", "area"].map((option) => (
                    <label key={option} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={
                          chartConfig?.[option as keyof ChartConfig] || false
                        }
                        onChange={(e) =>
                          setChartConfig((prev) => ({
                            ...prev!,
                            [option]: e.target.checked,
                          }))
                        }
                        className="rounded text-blue-500 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 capitalize">
                        {option}
                      </span>
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
