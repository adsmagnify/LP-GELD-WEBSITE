import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Pretty paths → section ids on the single-page landing */
const SECTION_REDIRECTS: Record<string, string> = {
  "/about": "about",
  "/webinar": "webinar",
  "/learn": "learn",
  "/speakers": "speaker",
  "/speaker": "speaker",
  "/contact": "register-form",
  "/performance": "performance",
  "/faq": "faq",
  "/register": "register-form",
};

function isPassthrough(pathname: string): boolean {
  if (pathname === "/") return true;
  if (pathname.startsWith("/api")) return true;
  if (pathname.startsWith("/studio")) return true;
  if (pathname === "/thank-you" || pathname.startsWith("/thank-you/")) return true;
  if (pathname.startsWith("/_next")) return true;
  // Static files (favicon, images, etc.)
  if (/\.[a-zA-Z0-9]+$/.test(pathname)) return true;
  return false;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const normalized = pathname.replace(/\/+$/, "") || "/";

  if (isPassthrough(normalized) || isPassthrough(pathname)) {
    return NextResponse.next();
  }

  const section =
    SECTION_REDIRECTS[normalized.toLowerCase()] ||
    SECTION_REDIRECTS[pathname.toLowerCase()];

  if (section) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    url.searchParams.set("section", section);
    return NextResponse.redirect(url);
  }

  // Unknown paths (e.g. /hello) → home, never 404
  const home = request.nextUrl.clone();
  home.pathname = "/";
  home.search = "";
  return NextResponse.redirect(home);
}

export const config = {
  matcher: [
    /*
     * Match all paths except Next internals and common static assets.
     * Middleware still double-checks extensions in isPassthrough.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
