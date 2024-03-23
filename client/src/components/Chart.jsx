import { Bar } from 'react-chartjs-2'; // Import Bar component from react-chartjs-2

import { Chart as ChartJS ,registerables} from 'chart.js/auto';
ChartJS.register(...registerables);
const Chart = ({
  totalAmountsSpent,
  transactionAmounts,
  categoryLabels,
  budgetAmounts
}) => {


    console.log(totalAmountsSpent,categoryLabels,budgetAmounts, transactionAmounts);
    // return
    const chartData = {
        labels: categoryLabels,
        datasets: [
          {
            label: 'Budget Amount',
            backgroundColor: 'rgba(16, 227, 12, 0.5)',
            borderColor: 'rgba(16, 227, 12, 1)',
            borderWidth: 1,
            data: budgetAmounts,
          },
          {
            label: 'Total Amount Spent',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            data: totalAmountsSpent,
          },
          {
            label: 'Transaction Amount',
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            data: transactionAmounts,
          },
        ],
      };
    
      const chartOptions = {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          yAxes: [{ stacked: true }],
          xAxes: [{ stacked: true }],
        },
      };

  return  <div className="bar-chart-area">
    <Bar  data={chartData} options={chartOptions} />

    </div>
};

export default Chart;
