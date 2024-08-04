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
import { loginSchema } from "@/schemas";
import { z, ZodError } from "zod";

import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/FormError";
import { FormSuccess } from "../FormSuccess";
import { login } from "@/actions/login";
import { useEffect, useState, useTransition } from "react";


type LoginResponse = 
  | { error: ZodError<{ email: string; password: string; }>; message: string; success?: never }
  | { error: boolean; message: string; success?: never }
  | { error: boolean; message: string; success: boolean };

export const LoginForm = () => {
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error") === "OAuthAccountNotLinked" ? "Please use the same method you use to register your account" : "";

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const[showAlert , setShowAlert] = useState<boolean>(false)

  useEffect(()=>{
    setShowAlert(true)
    const timeoutId = setTimeout(()=>setShowAlert(false), 5000)
    return ()=> clearTimeout(timeoutId)
  },[success , error])

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmitHandler = (values: z.infer<typeof loginSchema>) => {
    setError("");
    setSuccess("");
  
    startTransition(() => {
      login(values).then((data : any) => {
        setError(data?.error ? data.message : "");
        if (data?.success !== undefined) {
          setSuccess(data?.message ? data.message : "");
        }
      }).catch((error) => {
        // Handle any potential errors from the login function
        setError(error.message || "An error occurred");
      });
    });
  };

  return (
    <CardWrapper
      headerLabel="Welcome Back"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/register"
      showSocial
    >
      <Form {...form}>
        <form
          className="flex flex-col space-y-6"
          onSubmit={form.handleSubmit(onSubmitHandler)}
        >
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="joe_doe@example.com"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="**********"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
          </div>
          {showAlert && <FormError message={error || urlError} />}
          {showAlert && <FormSuccess message={success} />}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-slate-500 to-slate-800 text-white"
            disabled={isPending}
          >
            Login
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
