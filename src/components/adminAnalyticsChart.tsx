/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Line } from "react-chartjs-2";
import {
  Chart,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminAnalyticsChart({ analytics }: any) {
  const data = {
    labels: Array.from(
      new Set([
        ...analytics.paymentStatusData.map((item: any) => item.status),
        ...analytics.documentStatusData.map((item: any) => item.status),
      ])
    ),
    datasets: [
      {
        label: "Payment Status Count",
        data: analytics.paymentStatusData.map((item: any) => item.count),
        borderColor: "#36A2EB",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        pointBackgroundColor: "#36A2EB",
        pointBorderColor: "#fff",
        tension: 0.4,
      },
      {
        label: "Document Status Count",
        data: analytics.documentStatusData.map((item: any) => {
          const match = analytics.paymentStatusData.find(
            (statusItem: any) => statusItem.status === item.status
          );
          return match ? item.count : 0;
        }),
        borderColor: "#FF6384",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        pointBackgroundColor: "#FF6384",
        pointBorderColor: "#fff",
        tension: 0.4,
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
      title: {
        display: true,
        text: "Admin Analytics: Payments and Documents",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Statuses",
        },
      },
      y: {
        title: {
          display: true,
          text: "Count",
        },
        beginAtZero: true,
      },
    },
  };

  return <Line data={data} options={options} />;
}
