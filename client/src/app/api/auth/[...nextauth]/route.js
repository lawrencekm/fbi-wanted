import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // to replace with actual authentication logic (e.g., database lookup)
        if (credentials.username === "admin@example.com" && credentials.password === "password") {
          return { id: "1", email: "admin@example.com" }; // Static ID for persistence
        } 
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (!token.id) {
        console.error("JWT token is missing user ID!");
        return null;
      }
      session.user.id = token.id;
      session.user.email = token.email;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    redirect: "/dashboard",
  },
});

export { handler as GET, handler as POST };
