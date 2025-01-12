/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

interface UserSummaryConfig {
  showPaymentsSummary?: boolean;
  showDocumentsSummary?: boolean;
  customLabels?: {
    paymentsTitle?: string;
    documentsTitle?: string;
    pendingLabel?: string;
    approvedLabel?: string;
    rejectedLabel?: string;
  };
}

const UserSummaryCard = ({
  userSummary,
  config,
}: {
  userSummary: any;
  config?: UserSummaryConfig;
}) => {
  const paymentBreakdown = userSummary?.paymentStatusBreakdown || {
    pending: 0,
    approved: 0,
    rejected: 0,
  };
  const documentBreakdown = userSummary?.documentStatusBreakdown || {
    pending: 0,
    approved: 0,
    rejected: 0,
  };

  const {
    showPaymentsSummary = true,
    showDocumentsSummary = true,
    customLabels = {},
  } = config || {};

  const {
    paymentsTitle = "Payments Summary",
    documentsTitle = "Documents Summary",
    pendingLabel = "Pending",
    approvedLabel = "Approved",
    rejectedLabel = "Rejected",
  } = customLabels;

  return (
    <div className="p-6 border flex flex-col lg:justify-around gap-5 rounded-lg shadow-lg bg-white w-full mx-auto lg:flex-row">
      {showPaymentsSummary && (
        <div className="mb-4">
          {/* Payments Summary */}
          <h4 className="font-semibold text-xl text-gray-700 mb-2">
            {paymentsTitle}
          </h4>
          <p className="text-sm text-gray-500">
            Total Payments: {userSummary?.totalPayments || 0}
          </p>
          <p className="text-sm text-gray-500">
            Total Amount: ${userSummary?.totalAmount || 0}
          </p>
          <p className="text-sm font-medium text-gray-700 mt-2">
            Status Breakdown:
          </p>
          <ul className="list-inside list-disc text-sm text-gray-500">
            <li>
              {pendingLabel}: {paymentBreakdown?.pending}
            </li>
            <li>
              {approvedLabel}: {paymentBreakdown?.approved}
            </li>
            <li>
              {rejectedLabel}: {paymentBreakdown?.rejected}
            </li>
          </ul>
        </div>
      )}

      {showDocumentsSummary && (
        <div>
          {/* Documents Summary */}
          <h4 className="font-semibold text-xl text-gray-700 mb-2">
            {documentsTitle}
          </h4>
          <p className="text-sm text-gray-500">
            Total Documents: {userSummary?.totalDocuments || 0}
          </p>
          <p className="text-sm font-medium text-gray-700 mt-2">
            Status Breakdown:
          </p>
          <ul className="list-inside list-disc text-sm text-gray-500">
            <li>
              {pendingLabel}: {documentBreakdown?.pending}
            </li>
            <li>
              {approvedLabel}: {documentBreakdown?.approved}
            </li>
            <li>
              {rejectedLabel}: {documentBreakdown?.rejected}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default function UserSummary({
  analytics,
  config,
}: {
  analytics: any;
  config?: UserSummaryConfig;
}) {
  return (
    <div className="space-y-6">
      <UserSummaryCard userSummary={analytics?.summary} config={config} />
    </div>
  );
}
