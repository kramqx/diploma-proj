import { NextResponse, type NextRequest } from "next/server";

const ONE_MB = 1024 * 1024;
const AUTH_PAGES = ["/auth"];
const PRIVATE_ROUTE_PREFIX = "/dashboard";

export function proxy(request: NextRequest) {
  const requestId = crypto.randomUUID();
  const { pathname } = request.nextUrl;

  const isApi = pathname.startsWith("/api") || pathname.startsWith("/trpc");
  const isAuthPage = AUTH_PAGES.some((page) => pathname.startsWith(page));
  const isPrivateRoute = pathname.startsWith(PRIVATE_ROUTE_PREFIX);

  if (isApi && !pathname.includes("/uploadthing")) {
    const contentLength = request.headers.get("content-length");
    if (contentLength !== null && Number(contentLength) > ONE_MB) {
      return new NextResponse(JSON.stringify({ error: "Payload Too Large", requestId }), {
        status: 413,
        headers: { "content-type": "application/json" },
      });
    }
  }

  const sessionToken =
    request.cookies.get("__Secure-next-auth.session-token")?.value !== undefined ||
    request.cookies.get("next-auth.session-token")?.value;

  if (!isApi) {
    if (isPrivateRoute && sessionToken === undefined && sessionToken === null) {
      console.log(`[Proxy] Redirect to Auth: ${pathname}`);
      const url = new URL("/auth", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    if (isAuthPage && sessionToken !== undefined && sessionToken !== null) {
      console.log(`[Proxy] Redirect to Dashboard: ${pathname}`);
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-request-id", requestId);
  requestHeaders.set("x-url", request.url);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set("x-request-id", requestId);
  response.cookies.set("last_request_id", requestId, {
    path: "/",
    maxAge: 60,
    httpOnly: false,
    sameSite: "lax",
  });

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images).*)"],
};
