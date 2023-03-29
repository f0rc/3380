// @ts-check
import { z } from "zod";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });
/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
export const serverSchema = z.object({
  VITE_BACKEND_URL: z.string(),
  PUBLIC_URL: z.string(),
  PGHOST: z.string(),
  PGUSER: z.string(),
  PGPASSWORD: z.string(),
  PGDATABASE: z.string(),
  PGPORT: z.string(),
});

/** @typedef {z.input<typeof serverSchema>} MergedInput */
/** @typedef {z.infer<typeof serverSchema>} MergedOutput */
/** @typedef {z.SafeParseReturnType<MergedInput, MergedOutput>} MergedSafeParseReturn */

const parsed = /** @type {MergedSafeParseReturn} */ serverSchema.safeParse(
  process.env
);

if (parsed.success === false) {
  console.error(
    "❌ Invalid environment variables:",
    parsed.error.flatten().fieldErrors
  );
  throw new Error("Invalid environment variables");
} else {
  console.log("✅ Environment variables are valid");
}

export const env = serverSchema.parse(process.env);
