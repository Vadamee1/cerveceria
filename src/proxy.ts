import { auth } from "@/auth";
import { NextResponse } from "next/server";

const adminRoutes = ["/users", "/inventory", "/reports"];

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  const isAuthPage = nextUrl.pathname.startsWith("/auth/login");
  const isAdminRoute = adminRoutes.some((route) =>
    nextUrl.pathname.startsWith(route),
  );

  if (!isLoggedIn && !isAuthPage) {
    return NextResponse.redirect(new URL("/auth/login", nextUrl));
  }

  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  if (isAdminRoute && userRole !== "Admin") {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
