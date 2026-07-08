import { decode } from "@auth/core/jwt";
import type { JWT } from "@auth/core/jwt";

const SESSION_SALTS = [
	"authjs.session-token",
	"__Secure-authjs.session-token",
];

/**
 * Verify a session JWT issued by Auth.js (JWT session strategy).
 *
 * This is runtime-agnostic (uses jose under the hood) so it can run both in
 * the Next.js web app and inside the Cloudflare Worker. Returns the decoded
 * session payload, or `null` if the token is missing, malformed, or expired.
 */
export async function verifyToken(
	token: string,
	secret: string,
): Promise<SessionPayload | null> {
	for (const salt of SESSION_SALTS) {
		try {
			const payload = (await decode({ token, secret, salt })) as
				| SessionPayload
				| null;
			if (payload) return payload;
		} catch {
			// try the next salt variant
		}
	}
	return null;
}

/** Shape of the data we store on the session token. */
export type SessionPayload = JWT & {
	sub?: string;
	email?: string;
	name?: string;
	picture?: string;
};

export type SessionUser = {
	id: string;
	email?: string;
	name?: string;
	image?: string;
};
