import Papa from "papaparse";

export interface IngredientInfo {
  name: string;
  scientific_name?: string;
  short_description?: string;
  what_is_it?: string;
  what_does_it_do?: string;
  who_is_it_good_for?: string;
  who_should_avoid?: string;
  url?: string;
}

let cachedMap: Map<string, IngredientInfo> | null = null;
let loadingPromise: Promise<Map<string, IngredientInfo>> | null = null;

const normalizeName = (n?: string) => {
  if (!n) return "";
  return n
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/[^a-z0-9\s\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

async function loadCsv(): Promise<Map<string, IngredientInfo>> {
  if (cachedMap) return cachedMap;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    try {
      // ✅ Try loading pre-generated JSON (put it in `/public/assets/ingredientsList.json`)
      const res = await fetch("/assets/ingredientsList.json");
      if (res.ok) {
        const data: Record<string, string>[] = await res.json();
        const map = new Map<string, IngredientInfo>();

        for (const row of data) {
          const name = (row["name"] || "").toString().trim();
          if (!name) continue;
          const info: IngredientInfo = {
            name,
            scientific_name: row["scientific_name"] || undefined,
            short_description: row["short_description"] || undefined,
            what_is_it: row["what_is_it"] || undefined,
            what_does_it_do: row["what_does_it_do"] || undefined,
            who_is_it_good_for: row["who_is_it_good_for"] || undefined,
            who_should_avoid: row["who_should_avoid"] || undefined,
            url: row["url"] || undefined,
          };

          const key = normalizeName(name);
          if (!map.has(key)) map.set(key, info);

          const parts = name
            .split(/[,/]/)
            .map((p) => p.trim())
            .filter(Boolean);
          for (const p of parts) {
            const k = normalizeName(p);
            if (k && !map.has(k)) map.set(k, info);
          }
        }

        cachedMap = map;
        return map;
      }
    } catch (err) {
      console.warn("JSON not found, falling back to CSV parsing...", err);
    }

    // ✅ Fallback: parse CSV from public folder at runtime
    const res = await fetch("/assets/ingredientsList.csv");
    if (!res.ok) throw new Error("Failed to fetch ingredients CSV");
    const text = await res.text();

    const parsed = Papa.parse<Record<string, string>>(text, {
      header: true,
      skipEmptyLines: true,
    });

    const map = new Map<string, IngredientInfo>();

    for (const row of parsed.data) {
      const name = (row["name"] || "").trim();
      if (!name) continue;
      const info: IngredientInfo = {
        name,
        scientific_name: row["scientific_name"] || undefined,
        short_description: row["short_description"] || undefined,
        what_is_it: row["what_is_it"] || undefined,
        what_does_it_do: row["what_does_it_do"] || undefined,
        who_is_it_good_for: row["who_is_it_good_for"] || undefined,
        who_should_avoid: row["who_should_avoid"] || undefined,
        url: row["url"] || undefined,
      };

      const key = normalizeName(name);
      if (!map.has(key)) map.set(key, info);

      const parts = name
        .split(/[,/]/)
        .map((p) => p.trim())
        .filter(Boolean);
      for (const p of parts) {
        const k = normalizeName(p);
        if (k && !map.has(k)) map.set(k, info);
      }
    }

    cachedMap = map;
    return map;
  })();

  return loadingPromise;
}

export async function getIngredientDetails(
  name: string
): Promise<IngredientInfo | null> {
  if (!name) return null;
  const map = await loadCsv();
  const key = normalizeName(name);
  if (map.has(key)) return map.get(key)!;

  const simplified = name.replace(/\d+%/g, "").replace(/[^a-zA-Z\s]/g, " ");
  const k2 = normalizeName(simplified);
  if (map.has(k2)) return map.get(k2)!;

  return null;
}
