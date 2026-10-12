import NextAuth from "next-auth";
import LinkedIn from "next-auth/providers/linkedin";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    LinkedIn({
      authorization: { params: { scope: "openid profile email" } },
    }),
  ],
  session: { strategy: "database" },
  pages: { signIn: "/auth/sign-in" },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        const persistedUser = await db.user.findUnique({ where: { id: user.id }, select: { role: true } });
        session.user.role = persistedUser?.role ?? "MEMBER";
      }
      return session;
    },
  },
});
