import React, { useState } from "react";
import Chart from "react-apexcharts";

const ChartProgress = () => {
  const [state, setState] = useState({
    series: [
      {
        name: "Option 01",
        data: [31],
      },
      {
        name: "Option 02",
        data: [12],
      },
      {
        name: "Option 03",
        data: [19],
      },
      {
        name: "Option 04",
        data: [35],
      },
    ],
    options: {
      colors: ["#EB5A3C", "#6E1946", "#FF961A", "#91BAB5"],
      chart: {
        type: "bar",
        height: 10,
        stacked: true,
        stackType: "100%",
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      stroke: {
        width: 3,
        colors: ["#fff"],
        show: true,
      },
      title: {
        text: undefined,
      },
      crosshairs: {
        show: false,
      },
      xaxis: {
        categories: [2008],
        show: false,
        labels: {
          show: false,
        },
      },
      tooltip: {
        enabled: false,
        y: {
          formatter: function (val) {
            return val + "K";
          },
        },
      },
      fill: {
        opacity: 1,
      },
      yaxis: {
        reversed: false,
        show: false,
      },
      legend: {
        position: "top",
        horizontalAlign: "left",
        offsetY: 10,
        offsetX: 0,
        onItemClick: {
          toggleDataSeries: false,
        },
        onItemHover: {
          highlightDataSeries: false,
        },
      },
    },
  });

  return <Chart options={state.options} type="bar" height="100%" series={state.series} />;
};

export default ChartProgress;
