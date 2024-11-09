import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { isNumber } from "lodash";
import { ChartConfig } from "./ChartConfiguration";

interface ChartProps {
  data: Record<string, any>[];
  config?: ChartConfig;
  height?: string;
  className?: string;
}

interface ProcessedSeriesData {
  name: string;
  type: string;
  data: number[];
  smooth?: boolean;
  areaStyle?: Record<string, any>;
  stack?: string;
}

// Default configuration for the chart
const DEFAULT_CONFIG: ChartConfig = {
  xAxis: "",
  series: [],
  title: "Data Visualization",
  chartType: "line",
  smooth: true,
  stack: false,
  area: false,
};

const isValidHeader = (header: string): boolean => {
  return (
    header &&
    typeof header === "string" &&
    !header.startsWith("column_") &&
    header.trim() !== ""
  );
};

// Tries to find time-related fields for X-axis and numeric fields for series
const detectDataType = (data: Record<string, any>[]): ChartConfig => {
  if (!data.length) return DEFAULT_CONFIG;

  const firstRow = data[0];
  const keys = Object.keys(firstRow).filter((k) => k !== "id");

  const timeRelatedKeys = ["day", "date", "month", "year"];
  const xAxis =
    keys.find(
      (key) =>
        timeRelatedKeys.includes(key.toLowerCase()) || !isNumber(firstRow[key])
    ) || keys[0];

  const series = keys
    .filter(
      (key) => key !== xAxis && isNumber(firstRow[key]) && isValidHeader(key)
    )
    .slice(0, 5);

  return {
    ...DEFAULT_CONFIG,
    xAxis,
    series,
  };
};

const processData = (
  data: Record<string, any>[],
  config: ChartConfig
): ProcessedSeriesData[] => {
  // Only process series with valid headers
  return config.series.filter(isValidHeader).map((seriesKey) => ({
    name: seriesKey,
    type: config.chartType || "line",
    smooth: config.smooth,
    data: data.map((item) => item[seriesKey]),
    ...(config.area && { areaStyle: { opacity: 0.1 } }),
    ...(config.stack && { stack: "total" }),
  }));
};

const Chart: React.FC<ChartProps> = ({
  data,
  config: userConfig,
  height = "100%",
  className = "",
}) => {
  const config = useMemo(() => {
    if (!data || !data.length) return null;
    return {
      ...DEFAULT_CONFIG,
      ...detectDataType(data),
      ...userConfig,
    };
  }, [data, userConfig]);

  const chartOptions = useMemo(() => {
    if (
      !Array.isArray(data) ||
      !data.length ||
      !config.xAxis ||
      !config.series.length
    ) {
      return null;
    }

    const hasValidData = data.every(
      (item) =>
        item[config.xAxis] !== undefined &&
        config.series.some((series) => item[series] !== undefined)
    );

    if (!hasValidData) return null;

    const series = processData(data, config);

    const xAxisData = data.map((item) => item[config.xAxis]);
    if (!series.length || !xAxisData.length) {
      return null;
    }

    return {
      grid: {
        top: 60,
        right: 40,
        bottom: 60,
        left: 60,
        containLabel: true,
      },
      title: {
        text: config.title,
        left: "center",
        top: 0,
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
        },
      },
      legend: {
        data: config.series.filter(isValidHeader),
        bottom: 5,
        type: "scroll",
        top: 30,
      },
      toolbox: {
        right: 10,
        feature: {
          dataZoom: {
            yAxisIndex: "none",
          },
          dataView: {
            readOnly: false,
          },
          magicType: {
            type: ["line", "bar", "stack"],
          },
          restore: {},
          saveAsImage: {},
        },
      },
      dataZoom: [
        {
          type: "inside",
          start: 0,
          end: 100,
        },
        {
          type: "slider",
          show: true,
          xAxisIndex: [0],
          bottom: 30,
          start: 0,
          end: 100,
        },
      ],
      xAxis: {
        type: "category",
        data: xAxisData,
        axisLabel: {
          rotate: 45,
        },
      },
      yAxis: {
        type: "value",
        splitLine: {
          lineStyle: {
            type: "dashed",
          },
        },
      },
      series,
      animation: false,
    };
  }, [data, config]);

  if (!chartOptions) {
    return null;
  }

  return (
    <div className={`relative ${className}`} style={{ height }}>
      <ReactECharts
        option={chartOptions}
        style={{ height: "100%", width: "100%" }}
        opts={{ renderer: "svg" }}
        notMerge={true} //ensure clean update
      />
    </div>
  );
};

export default Chart;
