import { db } from "@/lib/db";

export const getUserByEmail = async (email: string) => {
  try {
    const existingUser = await db.user.findFirst({
      where: {
        email,
      },
    });

    return existingUser;
  } catch (error) {
    return null;
  }
};

export const getUserById = async (id?: string) => {
  try {
    const existingUser = await db.user.findFirst({
      where: {
        id,
      },
    });

    return existingUser;
  } catch (error) {
    return null;
  }
};
