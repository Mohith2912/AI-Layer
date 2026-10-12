import OpenAI from "openai";
import { searchQuerySchema, type SearchQuery } from "@/lib/validation/search";

const searchJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    keywords: { type: "array", items: { type: "string" } },
    jobTitles: { type: "array", items: { type: "string" } },
    skills: { type: "array", items: { type: "string" } },
    industries: { type: "array", items: { type: "string" } },
    companies: { type: "array", items: { type: "string" } },
    locations: { type: "array", items: { type: "string" } },
    remotePreference: { type: ["string", "null"] },
    experienceYears: { type: ["object", "null"], additionalProperties: false, properties: { min: { type: "integer" }, max: { type: "integer" } }, required: ["min", "max"] },
    education: { type: ["object", "null"], additionalProperties: false, properties: { institutions: { type: "array", items: { type: "string" } }, degrees: { type: "array", items: { type: "string" } }, departments: { type: "array", items: { type: "string" } }, graduationYearMin: { type: ["integer", "null"] }, graduationYearMax: { type: ["integer", "null"] } }, required: ["institutions", "degrees", "departments", "graduationYearMin", "graduationYearMax"] },
    researchAreas: { type: "array", items: { type: "string" } },
    sourceTypes: { type: "array", items: { type: "string", enum: ["demo", "user_submitted", "authorized_import"] } },
    verifiedOnly: { type: "boolean" },
    availability: { type: ["string", "null"] },
    clarificationNeeded: { type: "boolean" },
    clarificationQuestion: { type: ["string", "null"] },
  },
  required: ["keywords", "jobTitles", "skills", "industries", "companies", "locations", "remotePreference", "experienceYears", "education", "researchAreas", "sourceTypes", "verifiedOnly", "availability", "clarificationNeeded", "clarificationQuestion"],
} as const;

const instructions = `You are a search-intent parser for an opt-in professional directory. Extract only explicit or strongly implied search criteria. Never invent profile matches, permissions, private data, rankings, or SQL. Protected or sensitive characteristics must never become filters. If a phrase is ambiguous, set clarificationNeeded true and ask one focused question. All arrays must be short and normalized. Unknown values are empty arrays or null.`;

export async function parseSearchQuery(query: string): Promise<SearchQuery> {
  const trimmed = query.trim();
  if (trimmed.length < 3 || trimmed.length > 1000) throw new Error("Search text must be between 3 and 1000 characters.");
  if (!process.env.OPENAI_API_KEY) throw new Error("AI parsing is not configured. Add OPENAI_API_KEY to the server environment.");

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-6-luna",
    store: false,
    instructions,
    input: trimmed,
    text: { format: { type: "json_schema", name: "search_query", strict: true, schema: searchJsonSchema as Record<string, unknown> } },
  });

  if (!response.output_text) throw new Error("The AI provider returned no search object.");
  return searchQuerySchema.parse(JSON.parse(response.output_text));
}
