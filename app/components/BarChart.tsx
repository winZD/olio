import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface BarChartProps {
  data: { year: number; _sum: { quantity: number | null } }[];
}
const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map((item) => item.year), // Extract years as labels
    datasets: [
      {
        label: "Quantity(kg)",
        data: data.map((item) => item._sum.quantity), // Extract quantities as data
        backgroundColor: [
          "rgba(255, 99, 132, 1)", // Solid red
          "rgba(255, 159, 64, 1)", // Solid orange
          "rgba(255, 205, 86, 1)", // Solid yellow
          "rgba(75, 192, 192, 1)", // Solid teal
          "rgba(54, 162, 235, 1)", // Solid blue
          "rgba(153, 102, 255, 1)", // Solid purple
          "rgba(201, 203, 207, 1)", // Solid grey
        ],
        /*  borderColor: "#4CAF50", */
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Year",
        },
      },
      y: {
        title: {
          display: true,
          /*  text: "Quantity", */
        },
        beginAtZero: true,
      },
    },
  };
  return <Bar data={chartData} options={options} />;
};

export default BarChart;
