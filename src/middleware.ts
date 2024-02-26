import routes from "@/lib/routes";
import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(req: NextRequest) {
  try {
    const session = await getToken({ req });
    if (req.nextUrl.pathname.startsWith('/auth') && session?.email) {
      return NextResponse.redirect(new URL(routes.dashboard.overview, req.url));
    }
    else if (req.nextUrl.pathname.startsWith('/dashboard') && !session?.email) {
      const loginUrl = new URL(routes.auth.login, req.url);
      loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname + req.nextUrl.search);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  } catch (error) {
    console.error("Error in middleware:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
