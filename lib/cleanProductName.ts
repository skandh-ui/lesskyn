export function cleanProductName(raw: string): string {
  if (!raw) return raw;

  let name = raw;

  // Remove everything after pipe |
  name = name.split("|")[0];

  // Remove common filler phrases
  const junkPatterns = [
    /for (men|women|all skin types).*/i,
    /with .*/i,
    /\b(face wash|cleanser)\b.*\b(face wash|cleanser)\b/i,
  ];

  for (const pattern of junkPatterns) {
    name = name.replace(pattern, "");
  }

  // Remove extra spaces
  name = name.replace(/\s{2,}/g, " ").trim();

  return name;
}
