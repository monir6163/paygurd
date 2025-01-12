/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { PaymentTypes } from "@/lib/types";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import axios from "axios";
import { toast } from "sonner";
import AnalyticsCards from "./analyticsCards";

export default function ViewAllPayments({ analytics }: { analytics: any }) {
  const [filter, setFilter] = React.useState<string>("all");
  const [date, setDate] = React.useState<string>("");
  const [payments, setPayments] = React.useState<PaymentTypes[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  const handleFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
  };
  const handleDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  // Fetch all payments based on filter and date
  async function getAllPayments() {
    try {
      const { data } = await axios.get(
        `/api/admin/allPayments?filter=${filter}&date=${date}`
      );
      setPayments(data.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.error);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    getAllPayments();
  }, [filter, date]);

  // Update payment status with id, email, and status
  const updatePaymentStatus = async (
    id: string,
    email: string,
    status: string
  ) => {
    try {
      const { data } = await axios.put(
        `/api/admin/allPayments?id=${id}&email=${email}&status=${status}`
      );
      if (data.status === 200) {
        toast.success(data.message);
        getAllPayments();
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.error);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <AnalyticsCards analytics={analytics} />
      {/* Filter with status and date */}
      <div className="flex items-center gap-3 mb-4 mt-4">
        <div>
          <select
            onChange={handleFilter}
            value={filter}
            className="border border-gray-300 rounded-md px-2 py-[7px]"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div>
          <input
            type="date"
            value={date}
            onChange={handleDate}
            className="border border-gray-300 rounded-md px-2 py-1"
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold text-base text-black">
              Title
            </TableHead>
            <TableHead className="font-bold text-base text-black">
              Amount
            </TableHead>
            <TableHead className="font-bold text-base text-black">
              Status
            </TableHead>
            <TableHead className="font-bold text-base text-black">
              Date
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments?.map((pay: PaymentTypes, i: number) => (
            <TableRow key={i}>
              <TableCell className="font-medium">{pay?.title}</TableCell>
              <TableCell>{pay?.amount}</TableCell>
              <TableCell>
                {/* Dropdown for changing status */}
                <select
                  value={pay?.status}
                  onChange={(e) =>
                    updatePaymentStatus(
                      pay?.id,
                      pay?.user_profiles?.email,
                      e.target.value
                    )
                  }
                  className="border border-gray-300 rounded-md px-2 py-1 capitalize"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </TableCell>
              <TableCell>{new Date(pay?.created_at).toDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
