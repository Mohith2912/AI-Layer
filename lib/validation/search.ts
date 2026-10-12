import { z } from "zod";

const boundedStrings = z.array(z.string().trim().min(1).max(80)).max(12);

export const searchQuerySchema = z.object({
  keywords: boundedStrings,
  jobTitles: boundedStrings,
  skills: boundedStrings,
  industries: boundedStrings,
  companies: boundedStrings,
  locations: boundedStrings,
  remotePreference: z.enum(["remote", "hybrid", "onsite"]).nullable(),
  experienceYears: z.object({ min: z.number().int().min(0).max(80), max: z.number().int().min(0).max(80) }).nullable(),
  education: z.object({
    institutions: boundedStrings,
    degrees: boundedStrings,
    departments: boundedStrings,
    graduationYearMin: z.number().int().min(1900).max(2100).nullable(),
    graduationYearMax: z.number().int().min(1900).max(2100).nullable(),
  }).nullable(),
  researchAreas: boundedStrings,
  sourceTypes: z.array(z.enum(["demo", "user_submitted", "authorized_import"])).max(3),
  verifiedOnly: z.boolean(),
  availability: z.enum(["open_to_mentoring", "open_to_work", "not_specified"]).nullable(),
  clarificationNeeded: z.boolean(),
  clarificationQuestion: z.string().max(240).nullable(),
});

export type SearchQuery = z.infer<typeof searchQuerySchema>;
