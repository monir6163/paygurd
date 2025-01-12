/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";

export default function ViewAllDocuments() {
  const [filter, setFilter] = React.useState<string>("all");
  const [date, setDate] = React.useState<string>("");
  const [documents, setDocuments] = React.useState<any[] | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [selectedFile, setSelectedFile] = React.useState<any | null>(null);

  const handleFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
  };
  const handleDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  // Fetch all documents based on filter and date
  async function getAllDocuments() {
    try {
      const { data } = await axios.get(
        `/api/admin/allDocuments?filter=${filter}&date=${date}`
      );
      setDocuments(data.data);
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
    getAllDocuments();
  }, [filter, date]);

  // Update document status with id, email, and status
  const updatePaymentStatus = async (
    id: string,
    email: string,
    status: string
  ) => {
    try {
      const { data } = await axios.put(
        `/api/admin/allDocuments?id=${id}&email=${email}&status=${status}`
      );
      if (data.status === 200) {
        toast.success(data.message);
        getAllDocuments();
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
      {/* Filter with status and date */}
      <div className="flex items-center gap-3 mb-4">
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
              Email
            </TableHead>
            <TableHead className="font-bold text-base text-black">
              File
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
          {documents?.map((doc: any, i: number) => (
            <TableRow key={i}>
              <TableCell className="font-medium">
                {doc?.user_profiles?.email}
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger
                    onClick={() => setSelectedFile(doc?.file_url)}
                    className="text-blue-500 underline cursor-pointer"
                  >
                    View File
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>File Preview</DialogTitle>
                    </DialogHeader>
                    <DialogDescription></DialogDescription>
                    {selectedFile?.endsWith(".pdf") ? (
                      <embed
                        src={selectedFile}
                        type="application/pdf"
                        width="100%"
                        height="600px"
                      />
                    ) : (
                      <img
                        src={selectedFile}
                        alt="Preview"
                        className="max-w-full max-h-[600px] mx-auto"
                      />
                    )}
                    {/* <a
                      href={selectedFile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 block text-blue-500 underline text-center"
                    >
                      Download File
                    </a> */}
                  </DialogContent>
                </Dialog>
              </TableCell>
              <TableCell>
                <select
                  value={doc?.status}
                  onChange={(e) =>
                    updatePaymentStatus(
                      doc?.id,
                      doc?.user_profiles?.email,
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
              <TableCell>{new Date(doc?.uploaded_at).toDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
