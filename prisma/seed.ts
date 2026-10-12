import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const profiles = [
    { displayName: "Ananya Ramesh", headline: "Senior Frontend Engineer at CareStack", jobTitle: "Senior Frontend Engineer", companyName: "CareStack", city: "Chennai", country: "India", institutionName: "Easwari Engineering College", graduationYear: 2019, skills: ["React", "TypeScript", "Design systems"] },
    { displayName: "Vignesh Kumar", headline: "ML Engineer at Healthify", jobTitle: "ML Engineer", companyName: "Healthify", city: "Bengaluru", country: "India", institutionName: "Easwari Engineering College", graduationYear: 2020, skills: ["Python", "Medical imaging", "PyTorch"] },
    { displayName: "Pranav Mohan", headline: "Product Manager at Freshworks", jobTitle: "Product Manager", companyName: "Freshworks", city: "Chennai", country: "India", institutionName: "Easwari Engineering College", graduationYear: 2018, skills: ["Product strategy", "B2B SaaS", "Mentoring"] },
  ];
  for (const [index, item] of profiles.entries()) {
    const demoUser = await db.user.upsert({ where: { email: `demo-${index + 1}@layer.local` }, update: { name: item.displayName }, create: { email: `demo-${index + 1}@layer.local`, name: item.displayName } });
    const profile = await db.profile.upsert({ where: { ownerId: demoUser.id }, update: { displayName: item.displayName, headline: item.headline, jobTitle: item.jobTitle, companyName: item.companyName, city: item.city, country: item.country, visibility: "MEMBERS", verification: "VERIFIED", sourceType: "DEMO" }, create: { ownerId: demoUser.id, displayName: item.displayName, headline: item.headline, jobTitle: item.jobTitle, companyName: item.companyName, city: item.city, country: item.country, visibility: "MEMBERS", verification: "VERIFIED", sourceType: "DEMO" } });
    await db.education.deleteMany({ where: { profileId: profile.id } });
    await db.education.create({ data: { profileId: profile.id, institutionName: item.institutionName, graduationYear: item.graduationYear, verification: "VERIFIED" } });
    for (const skillName of item.skills) {
      const skill = await db.skill.upsert({ where: { normalizedName: skillName.toLowerCase() }, update: {}, create: { name: skillName, normalizedName: skillName.toLowerCase() } });
      await db.profileSkill.upsert({ where: { profileId_skillId: { profileId: profile.id, skillId: skill.id } }, update: {}, create: { profileId: profile.id, skillId: skill.id } });
    }
    await db.profileSource.upsert({ where: { profileId: profile.id }, update: { sourceType: "DEMO", sourceName: "Layer demo dataset" }, create: { profileId: profile.id, sourceType: "DEMO", sourceName: "Layer demo dataset" } });
  }
}

main().finally(() => db.$disconnect());
