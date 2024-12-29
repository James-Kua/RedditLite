import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

export type PollDataProps = {
  poll_data?: {
    options: {
      text: string;
      vote_count: number;
      id: string;
    }[];
    total_vote_count: number;
    user_selection?: string;
    voting_end_timestamp: string;
  };
};

const PollData: React.FC<PollDataProps> = ({ poll_data }) => {
  if (!poll_data) {
    return null;
  }

  const currentTimestamp = new Date();
  const endTimestamp = new Date(poll_data.voting_end_timestamp);
  const isPollOpen = currentTimestamp < endTimestamp;
  
  const remainingTime = endTimestamp.getTime() - currentTimestamp.getTime();
  
  const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
  
  const parts = [];
  if (days > 0) parts.push(`${days} days`);
  if (hours > 0) parts.push(`${hours} hours`);
  if (minutes > 0) parts.push(`${minutes} minutes`);
  
  const remainingTimeText = `${parts.join(' ')} left`

  const data = {
    labels: poll_data.options.map((option) => option.text),
    datasets: [
      {
        label: "Votes",
        data: poll_data.options.map((option) => option.vote_count),
        backgroundColor: poll_data.options.map((option) =>
          poll_data.user_selection === option.id
            ? "rgba(38, 194, 129, 0.6)"
            : "rgba(0, 123, 255, 0.6)"
        ),
        borderColor: poll_data.options.map((option) =>
          poll_data.user_selection === option.id
            ? "rgba(38, 194, 129, 1)"
            : "rgba(0, 123, 255, 1)"
        ),
        barPercentage: 0.4,
        categoryPercentage: 0.8,
        maxBarThickness: 40,
      },
    ],
  };

  const options = {
    indexAxis: "y" as const,
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Poll Results",
      },
      datalabels: {
        display: true,
        color: "grey",
        clamp: true,
        anchor: "end" as const,
        align: "end" as const,
        formatter: (value: number) => value,
      },
    },
  };

  return (
    <div>
      <div className="max-w-screen overflow-x-auto">
        <div className="min-w-[400px] mx-0">
          <Bar data={data} options={options} />
        </div>
      </div>
      <div>
        {isPollOpen ? (
          <span className="text-xs">
            <span className="text-white">The poll is still open. </span>
            <span className="text-blue-500">{remainingTimeText}</span>
          </span>
        ) : null}
      </div>
      <span className="dark:text-white text-xs my-2">
        Total Votes: {poll_data.total_vote_count}
      </span>
    </div>
  );
};

export default PollData;
