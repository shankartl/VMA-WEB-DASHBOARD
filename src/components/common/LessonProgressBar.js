import React, { useState } from "react";
import { useEffect } from "react";
import Chart from "react-apexcharts";
import { LESSON_PROGRESS, USERLESSONS } from "../../constants/apiRoutes";
import api from "../../services/api";
import { data } from "./GenerateData";

const LessonProgressBar = ({ progressBarData }) => {
  const [progressData, setProgressData] = useState([]);

  const [state, setState] = useState({
    series: data,
    options: {
      chart: {
        height: 350,
        type: "heatmap",
        animations: {
          enabled: false,
        },
      },

      tooltip: {
        enabled: false,
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        labels: {
          show: false,
        },
      },
      plotOptions: {
        heatmap: {
          reverseNegativeShade: true,
          radius: 2,
          enableShades: false,
          colorScale: {
            ranges: [
              {
                from: 1,
                to: progressBarData,
                color: "#54C781", //green
              },
              {
                from: progressBarData + 1,
                to: 12,
                color: "#D9D9D9", //grey
              },
            ],
          },
        },
      },
      title: {
        text: "",
      },
    },
  });

  return <Chart options={state.options} type="heatmap" width="250px" height="60px" series={state.series} />;
};

export default LessonProgressBar;
