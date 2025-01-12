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
import { signup } from "@/app/actions/login";
import { loginSchema } from "../../utils/zod/login.types";
export default function Register() {
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(data: any) {
    try {
      setIsSubmitting(true);
      await signup(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <div className="space-y-4 border rounded-lg p-4">
      {/* <Toaster /> */}
      <div>
        <h1 className="text-2xl font-semibold">Sign Up</h1>
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
            Sign Up
          </LoadingButton>
        </form>
      </Form>
      <div>
        <p>
          you have an account?{" "}
          <Link
            href="/"
            className="text-blue-500 underline hover:text-blue-700"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
