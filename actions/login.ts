"use server";

import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { loginSchema } from "@/schemas";
import { z } from "zod";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/utils/data/user";
import { generateVerificationToken } from "@/utils/data/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const login = async (values: z.infer<typeof loginSchema>) => {
  const validatedFields = loginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: validatedFields.error, message: "Invalid fields!" };
  }

  const { email, password } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if(!existingUser || !existingUser.email){
    return {error: true , message: "Invalid credentials!"}
  }

  if(!existingUser.password){
  return {error: true , message: "Invalid credentials!"};
  }

  /**
   * TODO: check if email is verified
   * TODO: check if token is expired or not if YES: generate new one and inform user to verify email else just inform it to verify the email
   */
  if(!existingUser.emailVerified){
    const verificationToken =await generateVerificationToken(existingUser.email);
    await sendVerificationEmail(verificationToken.email , verificationToken.token);
    return {success: true , message: "Confirmation Email sent!. Please verify your email!"}
  }
  
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: true, message: "Invalid Credentials!" };
        default:
          return {error: true , message: "Something went wrong!"}     
      }
    }
    throw error;  // to redirect to login which is : DEFAULT_LOGIN_REDIRECT
  }
};
