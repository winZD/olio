import { ArcElement, Chart, Legend, Tooltip } from "chart.js";
import React from "react";
import { Pie } from "react-chartjs-2";

Chart.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  data: { location: string; percentage: string }[];
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map((item) => item.location),
    datasets: [
      {
        data: data.map((item) => parseFloat(item.percentage)),
        backgroundColor: [
          "#ff0033", // Bright fire engine red
          "#0066cc", // Deep navy blue
          "#009933", // Green
          "#ff9900", // Orange
          "#9900ff", // Purple
        ],
        borderWidth: 1,
      },
    ],
  };

  return <Pie data={chartData} />;
};

export default PieChart;
