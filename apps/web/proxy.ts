import { auth } from "@workspace/auth";

const proxy = auth((req) => {
	if (!req.auth && req.nextUrl.pathname.startsWith("/playground")) {
		const url = new URL("/login", req.nextUrl.origin);
		url.searchParams.set("callbackUrl", req.nextUrl.pathname);
		return Response.redirect(url, 307);
	}
});

export default proxy;

export const config = {
	matcher: ["/playground/:path*"],
};
