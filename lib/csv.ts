import fs from "fs";
import path from "path";
import csv from "csv-parser";

/* ---------- Types ---------- */

export interface CSVRow {
  [key: string]: string;
}

export interface MatchInput {
  commitment: "minimal" | "moderate" | "extensive";
  skinType: string;
  concern: string;
  preference: string;
}

/* ---------- CSV FILE MAP ---------- */

const CSV_FILE_MAP: Record<MatchInput["commitment"], string> = {
  minimal: "minimal.csv",
  moderate: "moderate.csv",
  extensive: "extensive.csv",
};

/* ---------- Cache ---------- */

const cache: Partial<Record<MatchInput["commitment"], CSVRow[]>> = {};

/* ---------- Helpers ---------- */

function normalize(value?: string): string {
  return value?.trim().toLowerCase() ?? "";
}

function normalizeLoose(value?: string): string {
  return value
    ?.toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]/g, "") // ⚠️ removes spaces too
    .trim() ?? "";
}

function looselyMatches(csvValue: string, userValue: string): boolean {
  const csvNorm = normalizeLoose(csvValue);
  const userNorm = normalizeLoose(userValue);

  return csvNorm.includes(userNorm) || userNorm.includes(csvNorm);
}

/* ---------- CSV Loader ---------- */

async function loadCSV(
  commitment: MatchInput["commitment"]
): Promise<CSVRow[]> {
  if (cache[commitment]) return cache[commitment]!;

  const filePath = path.join(process.cwd(), "data", CSV_FILE_MAP[commitment]);
  const rows: CSVRow[] = [];

  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath, { encoding: 'utf8' })
      .pipe(csv({ 
        skipLines: 0,
        mapHeaders: ({ header }) => header.trim()
      }))
      .on("data", (row) => {
        const clean: CSVRow = {};
        for (const key in row) {
          clean[key] = row[key]?.trim() ?? "";
        }
        rows.push(clean);
      })
      .on("end", resolve)
      .on("error", reject);
  });

  cache[commitment] = rows;
  return rows;
}

/* ---------- MATCHING FUNCTION ---------- */

export async function matchCSVRows(
  input: MatchInput
): Promise<CSVRow[]> {
  const rows = await loadCSV(input.commitment);

  const pref = normalizeLoose(input.preference);
  const concern = normalizeLoose(input.concern);
  const skin = normalize(input.skinType);

  console.log("=== DEBUG: CSV Matching ===");
  console.log("Total rows loaded:", rows.length);
  console.log("CSV Column names:", Object.keys(rows[0] || {}));
  console.log("\nInput normalized:");
  console.log("  skin:", `"${skin}"`);
  console.log("  concern:", `"${concern}"`);
  console.log("  preference:", `"${pref}"`);
  console.log("\nFirst row raw data:");
  console.log(rows[0]);

  // Match rows where:
  // - Concern and Preference match, AND
  // - Skin Type is either the user's skin type OR empty (generic)
  const matches = rows.filter((r) => {
    const rowSkinType = normalize(r["Skin Type"]);
    const skinTypeMatches = rowSkinType === skin || rowSkinType === "";
    
    const prefMatch = looselyMatches(r["Preference"], pref);
    const concernMatch = looselyMatches(r["Concern"], concern);

    return (
      skinTypeMatches &&
      prefMatch &&
      concernMatch
    );
  });

  console.log("\n✅ Total matches found:", matches.length);
  console.log("=========================\n");

  return matches;
}