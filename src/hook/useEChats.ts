import * as echarts from "echarts";
import { Ref, useEffect, useRef, useState } from "react";

const useEChats = (): [
  Ref<HTMLDivElement>,
  echarts.EChartsType | undefined
] => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartInstance, setChartInstance] = useState<echarts.EChartsType>();
  useEffect(() => {
    const chart = echarts.init(chartRef.current);
    setChartInstance(chart);
  }, []);
  return [chartRef, chartInstance];
};

export default useEChats;
