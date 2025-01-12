import { getCurrentUser } from "@/app/actions/login";
import DocumentUpload from "@/components/documentUpload";
import React from "react";

export default async function page() {
  const user = await getCurrentUser();
  return <DocumentUpload user={user} />;
}
