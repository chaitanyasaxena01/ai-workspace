import { auth } from "@workspace/auth";

const proxy = auth((req) => {
	const path = req.nextUrl.pathname;
	const protectedPath =
		path.startsWith("/playground") || path.startsWith("/dashboard");
	if (!req.auth && protectedPath) {
		const url = new URL("/login", req.nextUrl.origin);
		url.searchParams.set("callbackUrl", path);
		return Response.redirect(url, 307);
	}
});

export default proxy;

export const config = {
	matcher: ["/playground/:path*", "/dashboard/:path*"],
};
