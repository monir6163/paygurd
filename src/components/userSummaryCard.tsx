/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

const UserSummaryCard = ({ userSummary }: any) => {
  return (
    <div className="p-6 border flex flex-col  lg:justify-around gap-5 rounded-lg shadow-lg bg-white   w-full mx-auto lg:flex-row">
      <div className="mb-4">
        {/* Payments Summary */}
        <h4 className="font-semibold text-xl text-gray-700 mb-2">
          Payments Summary
        </h4>
        <p className="text-sm text-gray-500">
          Total Payments: {userSummary.totalPayments}
        </p>
        <p className="text-sm text-gray-500">
          Total Amount: ${userSummary.totalAmount}
        </p>
        <p className="text-sm font-medium text-gray-700 mt-2">
          Status Breakdown:
        </p>
        <ul className="list-inside list-disc text-sm text-gray-500">
          <li>Pending: {userSummary.paymentStatusBreakdown.pending}</li>
          <li>Completed: {userSummary.paymentStatusBreakdown.completed}</li>
          <li>Failed: {userSummary.paymentStatusBreakdown.failed}</li>
        </ul>
      </div>

      <div>
        {/* Documents Summary */}
        <h4 className="font-semibold text-xl text-gray-700 mb-2">
          Documents Summary
        </h4>
        <p className="text-sm text-gray-500">
          Total Documents: {userSummary.totalDocuments}
        </p>
        <p className="text-sm font-medium text-gray-700 mt-2">
          Status Breakdown:
        </p>
        <ul className="list-inside list-disc text-sm text-gray-500">
          <li>Pending: {userSummary.documentStatusBreakdown.pending}</li>
          <li>Approved: {userSummary.documentStatusBreakdown.approved}</li>
          <li>Rejected: {userSummary.documentStatusBreakdown.rejected}</li>
        </ul>
      </div>
    </div>
  );
};

export default function UserSummary({ analytics }: any) {
  return (
    <div className="space-y-6">
      {analytics.summary.map((user: any) => (
        <UserSummaryCard key={user.user_id} userSummary={user} />
      ))}
    </div>
  );
}
