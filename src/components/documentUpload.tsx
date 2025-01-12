/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { toast } from "sonner";
import { uploadDocument } from "@/app/actions/documents";

export default function DocumentUpload({ user }: { user: any }) {
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [file, setFile] = useState<any>(null);
  const [fileUrl, setFileUrl] = useState("");

  const handleFileChange = (e: any) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setFileUrl(reader.result as string);
      };

      reader.readAsDataURL(selectedFile);
      setFile(selectedFile);

      if (selectedFile.size > 5 * 1024 * 1024) {
        setErrorMessage("File size must be less than 5MB");
        return;
      }
      const fileExt = selectedFile?.name?.split(".").pop();
      if (!["png", "jpg", "pdf"].includes(fileExt)) {
        setErrorMessage("File type not supported");
        return;
      }
      setErrorMessage("");
    }
  };

  const onSubmit = async (e: any) => {
    try {
      e.preventDefault();
      if (!file) {
        setErrorMessage("Please select a file to upload");
        return;
      }
      setErrorMessage("");
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("File size must be less than 5MB");
        return;
      }
      const fileExt = file?.name?.split(".").pop();
      if (!["png", "jpg", "pdf"].includes(fileExt)) {
        setErrorMessage("File type not supported");
        return;
      }
      const fileName = `${Date.now()}-${fileExt}`;
      const filePath = `${fileName}`;
      setUploading(true);
      const result = await uploadDocument(file, filePath, user);
      setUploading(false);
      if ("error" in result) {
        setErrorMessage(result.error.message);
        return;
      }
      setFile(null);
      setErrorMessage("");
      if (result) {
        toast.success("Document uploaded successfully");
      }
    } catch (error) {
      setErrorMessage((error as any).message);
    }
  };

  return (
    <div className="flex items-center justify-center w-full">
      <form className="w-full" onSubmit={onSubmit}>
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-4 text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, PDF (MAX. 5MB)</p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
        {fileUrl && file && (
          <div className="mt-4 relative">
            {file?.type?.includes("image") ? (
              <img
                src={fileUrl}
                alt="Uploaded preview"
                className="w-64 h-64 object-cover rounded-lg border border-gray-300"
              />
            ) : file?.type === "application/pdf" ? (
              <iframe
                src={fileUrl}
                className="w-64 h-64 rounded-lg border border-gray-300"
                title="PDF Preview"
              />
            ) : (
              <p className="text-gray-500">
                Preview not available for this file type.
              </p>
            )}

            <button
              type="button"
              onClick={() => {
                setFile(null);
                setFileUrl("");
              }}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
              aria-label="Remove file"
            >
              ✕
            </button>
          </div>
        )}

        <button
          type="submit"
          className="mt-4 p-2 bg-blue-500 text-white rounded"
          disabled={uploading || !file}
        >
          {uploading ? "Uploading..." : "Upload Document"}
        </button>
      </form>
    </div>
  );
}
