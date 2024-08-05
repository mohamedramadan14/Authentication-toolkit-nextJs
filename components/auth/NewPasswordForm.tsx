"use client";

import { CardWrapper } from "@/components/auth/CardWrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/FormError";
import { FormSuccess } from "../FormSuccess";
import { useEffect, useState, useTransition } from "react";
import { newPasswordSchema } from "@/schemas";
import { newPassword } from "@/actions/new-password";
import { useSearchParams } from "next/navigation";

export const NewPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [showAlert, setShowAlert] = useState<boolean>(false);

  useEffect(() => {
    setShowAlert(true);
    const timeoutId = setTimeout(() => setShowAlert(false), 5000);
    return () => clearTimeout(timeoutId);
  }, [success, error]);

  const form = useForm<z.infer<typeof newPasswordSchema>>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: "",
    },
  });
  const onSubmitHandler = (values: z.infer<typeof newPasswordSchema>) => {
    console.log(values);

    setError("");
    setSuccess("");

    startTransition(() => {
      newPassword(values, token)
        .then((data: any) => {
          setError(data?.error ? data.message : "");
          if (data?.success !== undefined) {
            setSuccess(data?.message ? data.message : "");
          }
        })
        .catch((error) => {
          // Handle any potential errors from the send reset email functionality
          setError(error.message || "An error occurred");
        });
    });
  };

  return (
    <CardWrapper
      headerLabel="Enter New Password"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form
          className="flex flex-col space-y-6"
          onSubmit={form.handleSubmit(onSubmitHandler)}
        >
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="**************"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
          </div>
          {showAlert && <FormError message={error} />}
          {showAlert && <FormSuccess message={success} />}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-slate-500 to-slate-800 text-white"
            disabled={isPending}
          >
            Reset Password
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
