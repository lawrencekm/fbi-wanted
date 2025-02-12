"use client";

import { SessionProvider } from "next-auth/react";
import { useSession } from "next-auth/react";

export default function SessionWrapper({ children }) {
  const { data: session, status } = useSession();

  if (!session) {
    return <div>Loading...</div>;
  }
  if (status === "loading") {
    return <p>Loading session...</p>;
  }

  if (status === "unauthenticated") {
    return <p>You need to sign in to access this content.</p>;
  }
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
