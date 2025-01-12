/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { createClient } from "../../../utils/supabase/server";

export async function uploadDocument(file: File, filePath: string, user: any) {
  const supabase = await createClient();

  // Upload the file to Supabase storage
  const { error: uploadError, data: uploadData } = await supabase.storage
    .from("paygurd_documents")
    .upload(`documents/${filePath}`, file);

  if (uploadError) {
    console.error("Error uploading file:", uploadError);
    return { error: uploadError };
  }

  // Get the public URL of the uploaded file
  const { data: urlData } = await supabase.storage
    .from("paygurd_documents")
    .getPublicUrl(`documents/${filePath}`);

  // Insert the document record into the database
  const insertPayload = {
    file_url: urlData.publicUrl,
    user_id: user.id,
  };

  const { data: document, error: insertError } = await supabase
    .from("documents")
    .insert([insertPayload]);

  if (insertError) {
    console.error("Error inserting document into database:", insertError);
    return { error: insertError };
  }

  return { data: uploadData, document };
}
