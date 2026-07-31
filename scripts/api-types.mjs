#!/usr/bin/env node
/**
 * Refresh OpenAPI snapshot + generated TypeScript types.
 * Usage: OPENAPI_SCHEMA_URL=http://localhost:8000/openapi.json pnpm api:types
 * Does NOT run during build/CI by default — commit the snapshot.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const url = process.env.OPENAPI_SCHEMA_URL || "http://localhost:8000/openapi.json";
const outJson = join(root, "openapi", "openapi.json");
const outTs = join(root, "src", "types", "api.generated.ts");

mkdirSync(dirname(outJson), { recursive: true });

const res = await fetch(url);
if (!res.ok) {
  console.error(`Failed to fetch OpenAPI from ${url}: ${res.status}`);
  process.exit(1);
}
const text = await res.text();
JSON.parse(text); // validate JSON
writeFileSync(outJson, text);
console.log(`Wrote ${outJson}`);

execFileSync("pnpm", ["exec", "openapi-typescript", outJson, "-o", outTs], {
  stdio: "inherit",
  cwd: root,
});
console.log(`Wrote ${outTs}`);
