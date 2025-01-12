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
    return { error: "Invalid credintials" };
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
  // redirect("/dashboard");
  return { data: data };
}

// register a new user
export async function signup(userData: any) {
  const supabase = await createClient();
  const authData = {
    email: userData.email,
    password: userData.password,
    options: {
      data: {
        user_role: "user",
        // username: data.username,
      },
    },
  };

  const { error, data } = await supabase.auth.signUp(authData);

  if (error || !data) {
    return { error: "Invalid credintials" };
  }

  revalidatePath("/", "layout");
  // redirect("/");
  return { data: data };
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
