/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../../../utils/supabase/server";
import bcrypt from "bcrypt";

export async function login(credintial: any) {
  const supabase = await createClient();
  const authData = {
    email: credintial.email,
    password: credintial.password,
  };
  const hashPassword = await bcrypt.hash(authData.password, 10);

  const { error, data } = await supabase.auth.signInWithPassword(authData);

  if (error) {
    return { error: error.message };
  }
  //check existing user
  const { data: existingUser } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("email", credintial?.email)
    .limit(1)
    .single();

  if (!existingUser) {
    await supabase.from("user_profiles").insert([
      {
        id: data.user.id,
        email: data.user.email,
        password: hashPassword,
        role: data.user.user_metadata?.user_role,
      },
    ]);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

// register a new user
export async function signup(data: any) {
  const supabase = await createClient();
  const authData = {
    email: data.email,
    password: data.password,
    options: {
      data: {
        user_role: "user",
        // username: data.username,
      },
    },
  };

  const { error } = await supabase.auth.signUp(authData);

  if (error) {
    return { error };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

// get the current user
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

// log out the current user
export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
