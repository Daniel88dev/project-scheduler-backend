import { NextFunction, Request, Response } from "express";
import { auth } from "../../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";

type Session = {
  sessionId: string;
  sessionToken: string;
  userId: string;
  userName: string;
  userEmail: string;
  emailVerified: boolean;
};

export const protectedRoute = async (req: Request): Promise<Session> => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  if (!session) {
    throw new Error("notAuthenticated");
  }

  return {
    sessionId: session.session.id,
    sessionToken: session.session.token,
    userId: session.user.id,
    userName: session.user.name,
    userEmail: session.user.email,
    emailVerified: session.user.emailVerified,
  };
};

export type AuthValidator<Session> = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<
  { success: true; session: Session } | { success: false; error: any }
>;

export const authValidator: (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<
  { success: true; session: Session } | { success: false; error: any }
> = async (req, res, next) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    if (!session) {
      return { success: false, error: "notAuthenticated" };
    }

    return {
      success: true,
      session: {
        sessionId: session.session.id,
        sessionToken: session.session.token,
        userId: session.user.id,
        userName: session.user.name,
        userEmail: session.user.email,
        emailVerified: session.user.emailVerified,
      },
    };
  } catch (error) {
    return { success: false, error };
  }
};
