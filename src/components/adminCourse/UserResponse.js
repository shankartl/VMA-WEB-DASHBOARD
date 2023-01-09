import { Box, Stack, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as chartjs } from "chart.js/auto";
import { ResponseData } from "../utils/ResponseData";
import { Chart } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(ChartDataLabels);

const UserResponse = () => {
  const [userRes, setUserRes] = useState({
    labels: ResponseData.map((data) => data.label),
    datasets: [
      {
        label: "User Response",
        data: ResponseData.map((data) => data.percentage),
        backgroundColor: ["#91BAB5"],
        borderRadius: 5,
        barThickness: 52,
        datalabels: {
          color: "black",
          font: {
            weight: "bold",
          },
        },
      },
    ],
  });
  return (
    <>
      <Box bg="greyBox" my="5" px="4">
        <Text fontSize="xs" pt="4" mb="1" fontWeight="bold">
          How was your overall experience with GuitarXR ?
        </Text>

        <Stack h="150px" borderTop="1px solid lightgrey" ml="4" pt="2">
          <Bar
            data={userRes}
            options={{
              responsive: true,
              maintainAspectRatio: false,

              plugins: {
                tooltip: {
                  enabled: false,
                },
                legend: false,
                datalabels: {
                  formatter: (value, ctx) => {
                    const datapoints = ctx.chart.data.datasets[0].data;
                    const total = datapoints.reduce((total, datapoint) => total + datapoint, 0);
                    const percentage = (value / total) * 100;
                    return percentage + "%";
                  },
                },
              },

              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    display: false, //this will remove only the label
                  },
                  grid: {
                    display: false,
                    drawBorder: false,
                  },
                },
                x: {
                  ticks: {
                    color: "black",
                    font: {
                      size: 12,
                      weight: "bold",
                    },
                  },
                  grid: {
                    display: false,
                    drawOnChartArea: false,
                  },
                },
                xAxes: [
                  {
                    barPercentage: 0.1,
                  },
                ],
              },
            }}
          />
        </Stack>
      </Box>
    </>
  );
};

export default UserResponse;
