import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

/**
 * Auth.js v5 configuration.
 *
 * Uses the JWT session strategy so the same signed token can be verified by
 * the Cloudflare Worker at the edge (`@workspace/auth/session`). A single
 * demo Credentials provider is included so the playground works without an
 * external OAuth app — swap in real providers (GitHub, Google, …) here.
 */
export const authConfig = {
	trustHost: true,
	secret: process.env.AUTH_SECRET,
	session: { strategy: "jwt" },
	pages: {
		signIn: "/login",
	},
	providers: [
		Credentials({
			name: "Demo",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				const email = String(credentials?.email ?? "").trim();
				if (!email) return null;
				// Demo accept: any non-empty email. Replace with a real user
				// lookup / password check in production.
				return {
					id: email,
					email,
					name: email.split("@")[0] ?? email,
				};
			},
		}),
	],
	callbacks: {
		jwt({ token, user }) {
			if (user) {
				token.sub = user.id;
				if (user.email) token.email = user.email;
				if (user.name) token.name = user.name;
				if (user.image) token.picture = user.image;
			}
			return token;
		},
		session({ session, token }) {
			if (session.user) {
				session.user.id = token.sub ?? "";
				session.user.email = token.email ?? "";
				session.user.name = token.name ?? "";
				session.user.image = token.picture ?? undefined;
			}
			return session;
		},
	},
} satisfies NextAuthConfig;
