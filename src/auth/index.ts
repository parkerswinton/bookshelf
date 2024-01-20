import { db } from "@/db";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth, { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";

export const authConfig = {
  providers: [GitHub],
  adapter: DrizzleAdapter(db),
  callbacks: {
    async session(params) {
      if ("user" in params) {
        params.session.user.id = params.user.id;
      }
      return params.session;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signOut } = NextAuth(authConfig);
