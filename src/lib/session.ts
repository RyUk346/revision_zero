import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/** Returns the current session or throws if the caller is not authenticated. */
export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session;
}

export type FormResult = {
  ok: boolean;
  message?: string;
  error?: string;
};
