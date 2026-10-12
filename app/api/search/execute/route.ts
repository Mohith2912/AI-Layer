import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { searchQuerySchema } from "@/lib/validation/search";
import { z } from "zod";

const requestSchema = z.object({ search: searchQuerySchema, page: z.number().int().min(1).max(100).default(1), pageSize: z.number().int().min(1).max(50).default(20) });

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  try {
    const body = requestSchema.parse(await request.json());
    const { search, page, pageSize } = body;
    const educationFilters = search.education?.institutions ?? [];
    const locationFilters = search.locations;
    const profiles = await db.profile.findMany({
      where: {
        deletedAt: null,
        visibility: { in: ["MEMBERS", "PUBLIC"] },
        ...(search.verifiedOnly ? { verification: "VERIFIED" } : {}),
        ...(educationFilters.length ? { education: { some: { institutionName: { in: educationFilters, mode: "insensitive" }, ...(search.education?.graduationYearMin ? { graduationYear: { gte: search.education.graduationYearMin } } : {}), ...(search.education?.graduationYearMax ? { graduationYear: { lte: search.education.graduationYearMax } } : {}) } } } : {}),
        ...(locationFilters.length ? { OR: locationFilters.map((location) => ({ city: { contains: location, mode: "insensitive" as const } })) } : {}),
      },
      include: { skills: { include: { skill: true } }, education: true, source: true },
      orderBy: [{ verification: "desc" }, { updatedAt: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return NextResponse.json({ results: profiles, page, pageSize });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: "Invalid search object.", details: error.flatten() }, { status: 400 });
    return NextResponse.json({ error: "Search could not be completed." }, { status: 500 });
  }
}
