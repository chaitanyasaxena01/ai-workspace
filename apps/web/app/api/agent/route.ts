import { auth } from "@workspace/auth";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

/**
 * Server-side proxy to the Cloudflare Worker agent runtime.
 *
 * The browser calls this route (so the Worker URL + session token never leak
 * to the client). We forward the request body as a stream and pipe the
 * Worker's AI SDK UI-message stream straight back to `useChat`.
 */
export async function POST(req: NextRequest) {
	const session = await auth();
	if (!session?.user) {
		return new Response("Unauthorized", { status: 401 });
	}

	const cookieStore = await cookies();
	const token =
		cookieStore.get("authjs.session-token")?.value ??
		cookieStore.get("__Secure-authjs.session-token")?.value ??
		"";

	const workerUrl = `${process.env.NEXT_PUBLIC_WORKER_URL ?? "http://localhost:8787"}/v1/agent`;

	const init: RequestInit & { duplex: "half" } = {
		method: "POST",
		headers: {
			"content-type": "application/json",
			authorization: `Bearer ${token}`,
		},
		body: req.body,
		duplex: "half",
	};

	const upstream = await fetch(workerUrl, init);

	return new Response(upstream.body, {
		status: upstream.status,
		headers: {
			"content-type": upstream.headers.get("content-type") ?? "text/plain",
		},
	});
}
