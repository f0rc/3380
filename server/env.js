"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = exports.serverSchema = void 0;
// @ts-check
var zod_1 = require("zod");
var dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: ".env" });
/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
exports.serverSchema = zod_1.z.object({
    VITE_BACKEND_URL: zod_1.z.string(),
    PUBLIC_URL: zod_1.z.string(),
    PGHOST: zod_1.z.string(),
    PGUSER: zod_1.z.string(),
    PGPASSWORD: zod_1.z.string(),
    PGDATABASE: zod_1.z.string(),
    PGPORT: zod_1.z.string(),
});
/** @typedef {z.input<typeof serverSchema>} MergedInput */
/** @typedef {z.infer<typeof serverSchema>} MergedOutput */
/** @typedef {z.SafeParseReturnType<MergedInput, MergedOutput>} MergedSafeParseReturn */
var parsed = /** @type {MergedSafeParseReturn} */ exports.serverSchema.safeParse(process.env);
if (parsed.success === false) {
    console.error("❌ Invalid environment variables:", parsed.error.flatten().fieldErrors);
    throw new Error("Invalid environment variables");
}
else {
    console.log("✅ Environment variables are valid");
}
exports.env = exports.serverSchema.parse(process.env);
