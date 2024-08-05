"use server"

import { newPasswordSchema } from "@/schemas";
import { getPasswordResetTokenByToken } from "@/utils/data/password-reset-token";
import { getUserByEmail } from "@/utils/data/user";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export const newPassword = async (
  values: z.infer<typeof newPasswordSchema>,
  token?: string | null
) => {
  if (!token) {
    return {
      error: true,
      message: "Token not found!",
    };
  }
  const validatedFields = newPasswordSchema.safeParse(values);
  if (!validatedFields.success) {
    return {
      error: true,
      message: "Invalid fields!",
    };
  }

  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetTokenByToken(token);
  console.log(existingToken);
  
  if (!existingToken) {
    return {
      error: true,
      message: "Invalid Token!",
    };
  }

  const hasExpired = existingToken.expires.getTime() < new Date().getTime();
  if (hasExpired) {
    return {
      error: true,
      message: "Token has expired!",
    };
  }

  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return {
      error: true,
      message: "Email doesn't exist!",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  await db.passwordResetToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  return {
    success: true,
    message: "Password reset successfully!",
  };
};
