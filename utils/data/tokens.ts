import crypto from "crypto";

import { db } from "@/lib/db";
import { v4 as uuidV4 } from "uuid";
import { getVerificationTokenByEmail } from "@/utils/data/verification-token";
import { getPasswordResetTokenByEmail } from "@/utils/data/password-reset-token";
import { getTwoFactorTokenByEmail } from "@/utils/data/two-factor-token";

export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 999_999).toString();

  // TODO: change to 1 hour later for production to be safe
  const expires = new Date(new Date().getTime() + 3600_000);

  const existingToken = await getTwoFactorTokenByEmail(email);
  if (existingToken) {
    await db.twoFactorToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const newTwoFactorToken = await db.twoFactorToken.create({
    data: {
      email,
      expires,
      token,
    },
  });

  return newTwoFactorToken;
};

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidV4();
  const expires = new Date(new Date().getTime() + 3600000);
  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await db.passwordResetToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const newPasswordResetToken = await db.passwordResetToken.create({
    data: {
      email,
      expires,
      token,
    },
  });

  return newPasswordResetToken;
};
export const generateVerificationToken = async (email: string) => {
  const token = uuidV4();
  const expires = new Date(new Date().getTime() + 3600000);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const newVerificationToken = await db.verificationToken.create({
    data: {
      email,
      expires,
      token,
    },
  });

  return newVerificationToken;
};
