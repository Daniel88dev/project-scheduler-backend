import { Request } from "express";
import { auth } from "../../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";

export const protectedRoute = async (req: Request) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session) {
    throw new Error("notAuthenticated");
  }

  return session;
};
