import { getCurrentUser } from "@/app/actions/login";
import Login from "@/components/login";
import { redirect } from "next/navigation";
import React from "react";

export default async function page() {
  const user = await getCurrentUser();
  if (user) {
    return redirect("/dashboard");
  }
  return (
    <main className="flex justify-center items-center h-screen">
      <div className="max-w-md w-full m-auto my-10 space-y-10">
        <div>
          <Login />
        </div>
      </div>
    </main>
  );
}
