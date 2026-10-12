import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const reportSchema = z.object({ profileId: z.string().cuid(), reason: z.string().trim().min(3).max(120), details: z.string().trim().max(1000).optional() });

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  try {
    const data = reportSchema.parse(await request.json());
    const report = await db.profileReport.create({ data: { ...data, reporterId: session.user.id } });
    return NextResponse.json({ report }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: "Invalid report.", details: error.flatten() }, { status: 400 });
    return NextResponse.json({ error: "Report could not be submitted." }, { status: 500 });
  }
}
