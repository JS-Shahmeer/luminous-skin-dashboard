import { NextResponse } from "next/server";
import { auth } from "@/auth";

const studentRoutes = ["/dashboard", "/my-courses", "/learn", "/certificates", "/profile"];

export default auth((req) => {
  const { nextUrl } = req;
  const session = req.auth;

  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isStudentRoute = studentRoutes.some(
    (path) => nextUrl.pathname === path || nextUrl.pathname.startsWith(`${path}/`)
  );

  if (isAdminRoute && session?.user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (isStudentRoute && !session) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/my-courses/:path*",
    "/learn/:path*",
    "/certificates/:path*",
    "/profile/:path*",
    "/admin/:path*",
  ],
};
