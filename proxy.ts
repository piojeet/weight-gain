import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const access = request.cookies.get("accessToken")?.value;
  const refresh = request.cookies.get("refreshToken")?.value;

  if (!access && !refresh) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/my-account/:path*"],
};
