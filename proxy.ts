import { NextRequest, NextResponse } from "next/server";

const isValidToken = (token: string | undefined) => {
  if (!token) return false;

  try {
    const payload = token.split(".")[1];
    if (!payload) return false;

    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return typeof decoded.exp !== "number" || decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthPage = pathname === "/" || pathname === "/register";
  const token = request.cookies.get("token")?.value;
  const isLoggedIn = isValidToken(token);

  if (!isLoggedIn && !isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL("/feed", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
