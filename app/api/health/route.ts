import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    status: "ok",
    service: "layer",
    configured: {
      database: Boolean(process.env.DATABASE_URL),
      ai: Boolean(process.env.OPENAI_API_KEY),
      linkedIn: Boolean(process.env.AUTH_LINKEDIN_ID && process.env.AUTH_LINKEDIN_SECRET && process.env.AUTH_SECRET),
    },
  });
}
