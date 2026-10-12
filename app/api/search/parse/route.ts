import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { parseSearchQuery } from "@/lib/ai/parse-search";
import { z } from "zod";

const requestSchema = z.object({ query: z.string().trim().min(3).max(1000) });

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  try {
    const body = requestSchema.parse(await request.json());
    const search = await parseSearchQuery(body.query);
    return NextResponse.json({ search });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: "Invalid search request.", details: error.flatten() }, { status: 400 });
    const message = error instanceof Error ? error.message : "Search parsing failed.";
    const status = message.includes("not configured") ? 503 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
