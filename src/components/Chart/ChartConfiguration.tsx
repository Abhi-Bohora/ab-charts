import React, { useCallback, useEffect, useState } from "react";

interface Column {
  accessorKey: string;
  header: string;
}

export interface ChartConfig {
  xAxis: string;
  series: string[];
  title?: string;
  chartType?: "line" | "bar";
  smooth?: boolean;
  stack?: boolean;
  area?: boolean;
}

interface ChartConfigurationProps {
  data: any[];
  columns: Column[];
  isProcessing: boolean;
  onConfigChange: (config: ChartConfig) => void;
}

function ChartConfiguration({
  data,
  columns,
  isProcessing,
  onConfigChange,
}: ChartConfigurationProps) {
  const [chartConfig, setChartConfig] = useState<ChartConfig | undefined>();

  const detectChartConfig = useCallback(
    (data: any[]) => {
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
      onConfigChange(config);
    },
    [columns, onConfigChange]
  );

  useEffect(() => {
    if (!isProcessing && data.length > 0) {
      detectChartConfig(data);
    }
  }, [data, detectChartConfig, isProcessing]);

  const handleConfigUpdate = useCallback(
    (key: keyof ChartConfig, value: any) => {
      setChartConfig((prev) => {
        if (!prev) return undefined;
        const newConfig = { ...prev, [key]: value };
        onConfigChange(newConfig);
        return newConfig;
      });
    },
    [onConfigChange]
  );

  if (!chartConfig || columns.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="label">Chart Title</label>
        <input
          type="text"
          className="input input-success w-full max-w-xs"
          value={chartConfig.title || ""}
          onChange={(e) => handleConfigUpdate("title", e.target.value)}
        />
      </div>

      <div>
        <label className="label">X-Axis</label>
        <select
          className="select select-success w-full max-w-xs"
          value={chartConfig.xAxis}
          onChange={(e) => handleConfigUpdate("xAxis", e.target.value)}
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
          value={chartConfig.chartType}
          onChange={(e) =>
            handleConfigUpdate("chartType", e.target.value as "line" | "bar")
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
              checked={Boolean(chartConfig[option as keyof ChartConfig])}
              onChange={(e) =>
                handleConfigUpdate(
                  option as keyof ChartConfig,
                  e.target.checked
                )
              }
              className="checkbox checkbox-success"
            />
            <span className="label-text capitalize">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default ChartConfiguration;
