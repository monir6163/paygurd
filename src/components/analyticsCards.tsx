/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

interface CardProps {
  title: string;
  count: number;
  color: string;
  icon: React.ReactNode;
}

const Card = ({ title, count, color, icon }: CardProps) => {
  return (
    <div
      className={`flex items-center justify-between p-5 rounded-lg shadow-md ${color} text-white`}
    >
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-2xl font-bold mt-2">{count}</p>
      </div>
      <div className="text-4xl">{icon}</div>
    </div>
  );
};

export default function AnalyticsCards({ analytics }: any) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card
        title="Total Payments"
        count={analytics?.totalPayments}
        color="bg-blue-500"
        icon={<i className="fas fa-dollar-sign" />}
      />
      <Card
        title="Pending Payments"
        count={
          analytics?.statusData.find(
            (status: any) => status.status === "pending"
          )?.count || 0
        }
        color="bg-yellow-500"
        icon={<i className="fas fa-hourglass-half" />}
      />
      <Card
        title="Approved Payments"
        count={
          analytics?.statusData.find(
            (status: any) => status.status === "approved"
          )?.count || 0
        }
        color="bg-green-500"
        icon={<i className="fas fa-check-circle" />}
      />
      <Card
        title="Rejected Payments"
        count={
          analytics?.statusData.find(
            (status: any) => status.status === "rejected"
          )?.count || 0
        }
        color="bg-red-500"
        icon={<i className="fas fa-times-circle" />}
      />
    </div>
  );
}
