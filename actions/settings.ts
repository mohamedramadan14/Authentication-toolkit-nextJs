"use server";
import  bcrypt  from 'bcryptjs';

import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mail";
import { settingsSchema } from "@/schemas";
import { generateVerificationToken } from "@/utils/data/tokens";
import { getUserByEmail, getUserById } from "@/utils/data/user";
import * as z from "zod";

export async function updateSettings(settings: z.infer<typeof settingsSchema>) {
  const user = await currentUser();
  if (!user) return { error: "unauthorized" };
  const existingUser = await getUserById(user?.id);
  if (!existingUser) return { error: "unauthorized" };

  if (user.isOAuth) {
    settings.email = undefined;
    settings.password = undefined;
    settings.newPassword = undefined;
    settings.isTwoFactorEnabled = undefined;
  }

  if (settings.email && settings.email !== user.email) {
    const existingUser = await getUserByEmail(settings.email);
    if (existingUser && existingUser.id !== user.id)
      return { error: "Email already in use!" };
 
    const verificationToken = await generateVerificationToken(settings.email);
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { success: "Verification email sent!" };
  }

  if(settings.password && settings.newPassword && existingUser.password){
      const passwordMatch = await bcrypt.compare(settings.password, existingUser.password);
      if(!passwordMatch) return { error: "Incorrect password!" };
      const hashedPassword = await bcrypt.hash(settings.newPassword, 10);
      settings.password = hashedPassword;
  }

  await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      ...settings,
    },
  });

  return { success: "Settings updated successfully" };
}
