import NextAuth from "next-auth";

import { authConfig } from "./config";

const nextAuth = NextAuth(authConfig);

export const handlers = nextAuth.handlers;
export const auth = nextAuth.auth;
export const signIn = nextAuth.signIn;
export const signOut = nextAuth.signOut;

export { authConfig };
export type { SessionPayload, SessionUser } from "./session";
export { verifyToken } from "./session";
