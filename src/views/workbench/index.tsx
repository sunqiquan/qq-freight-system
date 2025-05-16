/* eslint-disable react-hooks/exhaustive-deps */
import { Card, Button, Descriptions, DescriptionsProps } from "antd";
import { useStore } from "@/store";
import { useShallow } from "zustand/react/shallow";
import { formatNumber, formatState, formatCurrency } from "@/utils";
import styles from "./index.module.less";
import { useEffect, useState } from "react";
import { Workbench } from "@/types/api";
import useEChats from "@/hook/useEChats";
import api from "@/api";

const WorkbenchFC = () => {
  const userInfo = useStore(useShallow((state) => state.userInfo));

  const items: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "User ID",
      children: userInfo.userId,
    },
    {
      key: "2",
      label: "Email",
      children: userInfo.userEmail,
    },
    {
      key: "3",
      label: "State",
      children: formatState(userInfo.state),
    },
    {
      key: "4",
      label: "Mobile",
      children: userInfo.mobile,
    },
    {
      key: "5",
      label: "Job",
      children: userInfo.job,
    },
    {
      key: "6",
      label: "Department",
      children: userInfo.deptName,
    },
  ];

  // line chart
  const [lineRef, lineInstance] = useEChats();
  const renderLineChart = async () => {
    if (!lineInstance) return;
    const data = await api.getLineChartData();
    lineInstance?.setOption({
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: ["Order", "Revenue"],
      },
      grid: {
        left: 40,
        right: 20,
        bottom: 20,
      },
      xAxis: {
        data: data.label,
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "Order",
          type: "line",
          data: data.order,
        },
        {
          name: "Revenue",
          type: "line",
          data: data.money,
        },
      ],
    });
  };

  // driver age pie chart
  const [pieAgeRef, pieAgeInstance] = useEChats();
  const renderPieAgeChart = async () => {
    if (!pieAgeInstance) return;
    const data = await api.getPieAgeChartData();
    pieAgeInstance?.setOption({
      title: {
        text: "Age Distribution",
        left: "center",
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        orient: "vertical",
        left: "left",
      },
      series: [
        {
          name: "Age Distribution",
          type: "pie",
          radius: "50%",
          data,
        },
      ],
    });
  };

  // driver city pie chart
  const [pieCityRef, pieCityInstance] = useEChats();
  const renderPieCityChart = async () => {
    if (!pieCityInstance) return;
    const data = await api.getPieCityChartData();
    pieCityInstance?.setOption({
      title: {
        text: "City Distribution",
        left: "center",
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        orient: "vertical",
        left: "left",
      },
      series: [
        {
          name: "City Distribution",
          type: "pie",
          radius: [40, 120],
          roseType: "area",
          data,
        },
      ],
    });
  };

  // radar chart
  const [raderRef, raderInstance] = useEChats();
  const renderRadarChart = async () => {
    if (!raderInstance) return;
    const data = await api.getRadarChartData();
    raderInstance?.setOption({
      legend: { data: ["Model Diagnostic"] },
      radar: { indicator: data.indicator },
      series: [
        {
          name: "Model Diagnostic",
          type: "radar",
          data: [{ value: data.value }],
        },
      ],
    });
  };

  useEffect(() => {
    renderLineChart();
    renderPieAgeChart();
    renderPieCityChart();
    renderRadarChart();
  }, [lineInstance, pieAgeInstance, pieCityInstance, raderInstance]);

  const [reportData, setReportData] = useState<Workbench.ReportData>({
    driverCount: 0,
    totalMoney: 0,
    orderCount: 0,
    cityNum: 0,
  });

  const getReportData = async () => {
    const data = await api.getReportData();
    setReportData(data);
  };

  useEffect(() => {
    getReportData();
  }, []);

  return (
    <div className={styles.workbench}>
      <div className={styles.userinfo}>
        <img src={userInfo.userImg || "/imgs/headimg.svg"} />
        <Descriptions
          title={`Welcome ${userInfo.userName}, Happy Everyday!`}
          items={items}
        />
      </div>
      <div className={styles.report}>
        <div className={styles.card}>
          <div className={styles.title}>Number of Drivers</div>
          <div className={styles.data}>
            {formatNumber(reportData.driverCount)}
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.title}>Gross Transaction Volume</div>
          <div className={styles.data}>
            {formatCurrency(reportData.totalMoney)}
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.title}>Total Orders</div>
          <div className={styles.data}>
            {formatNumber(reportData.orderCount)}
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.title}>Activated Cities</div>
          <div className={styles.data}>{formatNumber(reportData.cityNum)}</div>
        </div>
      </div>
      <div className={styles.chart}>
        <Card
          title="Order and Revenue Trend"
          extra={
            <Button type="primary" onClick={renderLineChart}>
              Refresh
            </Button>
          }
        >
          <div ref={lineRef} className={styles.itemChart}></div>
        </Card>
      </div>
      <div className={styles.chart}>
        <Card
          title="Driver Distribution"
          extra={
            <Button
              type="primary"
              onClick={() => {
                renderPieAgeChart();
                renderPieCityChart();
              }}
            >
              Refresh
            </Button>
          }
        >
          <div className={styles.pieChart}>
            <div ref={pieAgeRef} className={styles.itemPie}></div>
            <div ref={pieCityRef} className={styles.itemPie}></div>
          </div>
        </Card>
      </div>
      <div className={styles.chart}>
        <Card
          title="Model Diagnosis"
          extra={
            <Button type="primary" onClick={renderRadarChart}>
              Refresh
            </Button>
          }
        >
          <div ref={raderRef} className={styles.itemChart}></div>
        </Card>
      </div>
    </div>
  );
};

export default WorkbenchFC;
