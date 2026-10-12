import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const profileSchema = z.object({ displayName: z.string().trim().min(1).max(120), headline: z.string().trim().max(160).nullable().optional(), bio: z.string().trim().max(2000).nullable().optional(), jobTitle: z.string().trim().max(120).nullable().optional(), companyName: z.string().trim().max(120).nullable().optional(), city: z.string().trim().max(80).nullable().optional(), country: z.string().trim().max(80).nullable().optional(), visibility: z.enum(["HIDDEN", "MEMBERS", "PUBLIC"]), availability: z.string().trim().max(80).nullable().optional(), institutionName: z.string().trim().max(160).nullable().optional(), graduationYear: z.number().int().min(1900).max(2100).nullable().optional(), skills: z.array(z.string().trim().min(1).max(60)).max(20).default([]), consentPurposeVersion: z.string().trim().min(1).max(40) });

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const profile = await db.profile.findUnique({ where: { ownerId: session.user.id }, include: { skills: { include: { skill: true } }, education: true, source: true, consentRecord: { orderBy: { consentedAt: "desc" }, take: 1 } } });
  return NextResponse.json({ profile });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  try {
    const data = profileSchema.parse(await request.json());
    const profile = await db.$transaction(async (transaction) => {
      const profile = await transaction.profile.upsert({ where: { ownerId: session.user.id }, update: { displayName: data.displayName, headline: data.headline, bio: data.bio, jobTitle: data.jobTitle, companyName: data.companyName, city: data.city, country: data.country, visibility: data.visibility, availability: data.availability, sourceType: "USER_SUBMITTED" }, create: { ownerId: session.user.id, displayName: data.displayName, headline: data.headline, bio: data.bio, jobTitle: data.jobTitle, companyName: data.companyName, city: data.city, country: data.country, visibility: data.visibility, availability: data.availability, sourceType: "USER_SUBMITTED" } });
      await transaction.education.deleteMany({ where: { profileId: profile.id } });
      await transaction.profileSkill.deleteMany({ where: { profileId: profile.id } });
      if (data.institutionName) await transaction.education.create({ data: { profileId: profile.id, institutionName: data.institutionName, graduationYear: data.graduationYear } });
      for (const skill of data.skills) {
        const normalizedName = skill.toLowerCase().replace(/\s+/g, " ").trim();
        const savedSkill = await transaction.skill.upsert({ where: { normalizedName }, update: { name: skill }, create: { name: skill, normalizedName } });
        await transaction.profileSkill.create({ data: { profileId: profile.id, skillId: savedSkill.id } });
      }
      await transaction.profileSource.upsert({ where: { profileId: profile.id }, update: { sourceType: "USER_SUBMITTED", sourceName: "Profile owner" }, create: { profileId: profile.id, sourceType: "USER_SUBMITTED", sourceName: "Profile owner" } });
      await transaction.consentRecord.create({ data: { profileId: profile.id, consentType: "directory_visibility", purposeVersion: data.consentPurposeVersion, visibility: data.visibility, recordedBy: session.user.id } });
      return profile;
    });
    return NextResponse.json({ profile }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: "Invalid profile data.", details: error.flatten() }, { status: 400 });
    return NextResponse.json({ error: "Profile could not be saved." }, { status: 500 });
  }
}
