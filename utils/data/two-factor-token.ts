import { db } from "@/lib/db";

export const getTwoFactorTokenByToken = async (token: string) => {
  try {
    const tokenData = await db.twoFactorToken.findUnique({
      where: {
        token,
      },
    });

    return tokenData;
  } catch (error) {
    return null;
  }
};

export const getTwoFactorTokenByEmail = async (email: string) => {
  try {
    const tokenData = await db.twoFactorToken.findFirst({
      where: {
        email,
      },
    });

    return tokenData;
  } catch (error) {
    return null;
  }
};
