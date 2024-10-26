import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { Line } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
  ChartData,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ChartDataLabels
);
type Props = {
  hourlyWeather?: [
    {
      temp: number;
      time: string;
    }
  ];
  city: string;
  scale: string;
};
const Chart = ({ hourlyWeather , city,scale }: Props) => {
  const labels = hourlyWeather?.map((el) => el.time);
  const data: ChartData<"line"> = {
    labels: labels,
    datasets: [
      {
        tension: 0.5,
        label: `Recent Trends for Daily Average Temperature for ${city} in ° ${scale}`,
        fill: true,
        backgroundColor: "#D6DAFE",
        borderColor: "#7D90FE",

        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "#7D90FE",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 5,
        pointHoverRadius(ctx) {
          if (ctx.dataIndex === 0) return 0;
          return 5;
        },
        pointHoverBackgroundColor: "#7D90FE",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 3,
        pointRadius(ctx) {
          if (ctx.dataIndex === 0) return 0;
          return 1;
        },
        pointHitRadius: 10,
        data: hourlyWeather?.map((el) => el.temp)!,
      },
    ],
  };

  const lineOptions: ChartOptions<"line"> = {
    plugins: {
      datalabels: {
        display: function (context) {
          return context.dataIndex !== 0;
        },
        align: "end",
        anchor: "end",
        color: "#aeadb1",
      },
      tooltip: {
        displayColors: false,
        filter(e, index, array, data) {
          if (array[index].dataIndex === 0) return false;
          return true;
        },
        callbacks: {
          label: function (context) {
            return "Temperature: " + context.parsed.y + "°"+`${scale}`;
          },
        },
      },
      legend: {
        labels: {
          boxWidth: 0,
        },
      },
    },

    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          callback(tickValue, index, ticks) {
            if (index === 0) return "";
            return labels![index];
          },
        },
      },
      y: {
        grid: {
          display: false,
        },
        min:
          Math.round(Math.min(...hourlyWeather!.map((o) => o.temp)) / 5) * 5 -
          5,
        max: Math.round(Math.max(...hourlyWeather!.map((o) => o.temp)) + 5),

        ticks: {
          // forces step size to be 50 units

          stepSize: 5,
        },
      },
    },
  };

  return (
    <div
    className="
      font-sans text-center bg-white 
      flex-1
      rounded-lg mx-5 md:mx-5 lg:mx-0 
      mb-5 
      border-2 border-gray-400 
      bg-primary-50
    "
  >
    <Line data={data} options={lineOptions} />
  </div>
);
};

export default Chart;