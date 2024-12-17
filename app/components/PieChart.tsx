import { ArcElement, Chart, Legend, Tooltip } from "chart.js";
import { Pie } from "react-chartjs-2";

Chart.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  const data = {
    labels: ["Customer", "Business"],
    datasets: [
      {
        data: [12, 29],
        backgroundColor: [
          "#ff0033", // Bright fire engine red
          "#0066cc", // Deep navy blue
        ],
        borderWidth: 1,
      },
    ],
  };

  return <Pie data={data} />;
};

export default PieChart;
