/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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

export default function AllPayments({ user_id }: any) {
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

  React.useEffect(() => {
    async function getAllPayments(user_id: string) {
      try {
        const { data } = await axios.get(
          `/api/payments?user_id=${user_id}&filter=${filter}&date=${date}`
        );
        setPayments(data.data);
      } catch (error) {
        toast.error("Failed to fetch payments data");
      } finally {
        setLoading(false);
      }
    }
    getAllPayments(user_id);
  }, [filter, date, user_id]);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      {/* filter with status and date */}
      <div className="flex  items-center gap-3">
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
              <TableCell className="capitalize">{pay?.status}</TableCell>
              <TableCell>{new Date(pay?.created_at).toDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
