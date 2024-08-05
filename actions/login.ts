"use server";

import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { loginSchema } from "@/schemas";
import { z } from "zod";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/utils/data/user";
import {
  generateVerificationToken,
  generateTwoFactorToken,
} from "@/utils/data/tokens";
import { sendVerificationEmail, sendTwoCodeEmail } from "@/lib/mail";
import { getTwoFactorTokenByEmail } from "@/utils/data/two-factor-token";
import { db } from "@/lib/db";
import { getTwoFactorConfirmationByUserId } from "@/utils/data/two-factor-confirmation";

export const login = async (values: z.infer<typeof loginSchema>) => {
  const validatedFields = loginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: validatedFields.error, message: "Invalid fields!" };
  }

  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email) {
    return { error: true, message: "Invalid credentials!" };
  }

  if (!existingUser.password) {
    return { error: true, message: "Invalid credentials!" };
  }

  /**
   * TODO: check if email is verified
   * TODO: check if token is expired or not if YES: generate new one and inform user to verify email else just inform it to verify the email
   */
  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );
    return {
      success: true,
      message: "Confirmation Email sent!. Please verify your email!",
    };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      // TODO: Verify Code
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

      if (!twoFactorToken) {
        return { error: true, message: "Invalid code!" };
      }

      if (twoFactorToken.token !== code) {
        return { error: true, message: "Invalid code!" };
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();
      if (hasExpired) {
        return { error: true, message: "Code expired!" };
      }
      await db.twoFactorToken.delete({
        where: {
          id: twoFactorToken.id,
        },
      });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );

      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: {
            id: existingConfirmation.id,
          },
        });
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
      /* return {success: true , twoFactor: true, message: "Two Factor Verified"} */
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoCodeEmail(twoFactorToken.email, twoFactorToken.token);
      return {
        success: true,
        twoFactor: true,
        message: "Two Factor Email sent!. Please verify your login!",
      };
    }
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
          return { error: true, message: "Something went wrong!" };
      }
    }
    throw error; // to redirect to login which is : DEFAULT_LOGIN_REDIRECT
  }
};
