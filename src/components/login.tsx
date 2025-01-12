/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import LoadingButton from "./loadingButton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { login } from "@/app/actions/login";
import { toast } from "sonner";
import { loginSchema } from "../../utils/zod/login.types";
import { useRouter } from "next/navigation";
export default function Login() {
  const { push } = useRouter();
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(userData: any) {
    setIsSubmitting(true);
    const { error, data } = await login(userData);
    if (data) {
      toast.success("Login successful");
      push("/dashboard");
    }
    if (error) {
      toast.error(error as string);
    }
    setIsSubmitting(false);
  }
  return (
    <div className="space-y-4 border rounded-lg p-4">
      <div>
        <h1 className="text-2xl font-semibold">Sign In</h1>
      </div>
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Valid email address"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="************"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <LoadingButton
            loading={isSubmitting}
            type="submit"
            className="w-full mt-5"
          >
            Sign In
          </LoadingButton>
        </form>
      </Form>
      <div>
        <p>
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-blue-500 underline hover:text-blue-700"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
