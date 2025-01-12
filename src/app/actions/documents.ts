/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { createClient } from "../../../utils/supabase/server";

export async function uploadDocument(file: File, filePath: string, user: any) {
  const supabase = await createClient();
  const { error, data } = await supabase.storage
    .from("paygurd_documents")
    .upload(`documents/${filePath}`, file);

  if (error) {
    return { error };
  }

  // get the file url
  const { data: url } = await supabase.storage
    .from("paygurd_documents")
    .getPublicUrl(`documents/${filePath}`);

  // submit the file url to the database document table
  const { data: document, error: docError } = await supabase
    .from("documents")
    .insert([{ file_url: url?.publicUrl, user_id: user.id }]);
  if (docError) {
    return { error: docError };
  }

  return { data, document };
}
