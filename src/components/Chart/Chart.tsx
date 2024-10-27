import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { isEmpty, isNumber } from "lodash";

interface ChartConfiguration {
  xAxis: string;
  series: string[];
  title?: string;
  chartType?: "line" | "bar";
  smooth?: boolean;
  stack?: boolean;
  area?: boolean;
}

interface ChartProps {
  data: Record<string, any>[];
  config?: ChartConfiguration;
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

const DEFAULT_CONFIG: ChartConfiguration = {
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

const detectDataType = (data: Record<string, any>[]): ChartConfiguration => {
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
  config: ChartConfiguration
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
  console.log(data, userConfig);
  const config = useMemo(
    () => ({
      ...DEFAULT_CONFIG,
      ...detectDataType(data),
      ...userConfig,
    }),
    [data, userConfig]
  );

  const chartOptions = useMemo(() => {
    if (isEmpty(data)) return null;

    const series = processData(data, config);

    const xAxisData = data.map((item) => item[config.xAxis]);

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
        top: 10,
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
        },
      },
      legend: {
        data: config.series.filter(isValidHeader),
        bottom: 0,
        type: "scroll",
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
      animation: true,
    };
  }, [data, config]);

  if (!chartOptions) {
    return (
      <div className="flex items-center justify-center h-full w-full text-gray-500">
        No data available
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ height }}>
      <ReactECharts
        option={chartOptions}
        style={{ height: "100%", width: "100%" }}
        opts={{ renderer: "svg" }}
      />
    </div>
  );
};

export default Chart;
