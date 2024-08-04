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
import { registerSchema } from "@/schemas";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/FormError";
import { FormSuccess } from "../FormSuccess";
import { useState, useTransition } from "react";
import { register } from "@/actions/register";

export const RegisterForm = () => {
  const[isPending , startTransition] = useTransition();
  const[error , setError] = useState<string>("");
  const [success , setSuccess] = useState<string>("");

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name:"",
      email: "",
      password: "",
    },
  });

  
const onSubmitHandler = (values: z.infer<typeof registerSchema>) => {
  setError("");
  setSuccess("");

  startTransition(() => {
    register(values).then((data) =>{
      setError(data.error? data.message : "");
      setSuccess(data.success ? data.message : "");
    });
  })

 console.log(values);
}

  return (
    <CardWrapper
      headerLabel="Create an account"
      backButtonLabel="Already have an account?"
      backButtonHref="/auth/login"
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="joe doe" {...field} disabled={isPending}/>
                </FormControl>
                <FormMessage /> 
              </FormItem>
            )}
          ></FormField>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="joe_doe@example.com" {...field} disabled={isPending}/>
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
                  <Input type="password" placeholder="**********" {...field} disabled={isPending}/>
                </FormControl>
                <FormMessage /> 
              </FormItem>
            )}
          ></FormField>
          </div>
            <FormError message={error} />
            <FormSuccess message={success} />
             <Button type="submit" className="w-full bg-gradient-to-r from-slate-500 to-slate-800 text-white" disabled={isPending}>
                Create an account
              </Button> 
        </form>
      </Form>
    </CardWrapper>
  );
};
