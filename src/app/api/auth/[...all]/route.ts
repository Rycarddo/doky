import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";

const { GET: _GET, POST: _POST } = toNextJsHandler(auth);

export async function GET(req: NextRequest) {
  const res = await _GET(req);

  // When the OAuth callback returns an error (e.g. unauthorized email),
  // redirect to the login page instead of showing raw JSON.
  if (res.status >= 400 && req.nextUrl.pathname.includes("/callback/")) {
    return NextResponse.redirect(new URL("/login?error=unauthorized", req.url));
  }

  return res;
}

export const POST = _POST;
