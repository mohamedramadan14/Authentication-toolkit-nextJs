import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import authConfig from "@/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { getUserById } from "./utils/data/user";
import NextAuth, { type DefaultSession } from "next-auth";
import { UserRole } from "@prisma/client";

export const { auth, handlers, signIn, signOut } = NextAuth({
  callbacks: {
  /*   async signIn({ user }) {
      if(!user.id) return false
      const existingUser = await getUserById(user.id);
      if (!existingUser || !existingUser.emailVerified) {
        return false;
      }
      return true;
    }, */
    async session({ session, token }) {
      console.log({ sessionToken: token });

      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;
      token.role = existingUser.role;
      return token;
    },
  },
  //providers: [GitHub, Google],
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
