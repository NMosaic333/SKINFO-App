import Papa from 'papaparse';

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
  if (!n) return '';
  return n
    .toLowerCase()
    .replace(/\(.*?\)/g, '') // remove parenthetical concentrations/notes
    .replace(/[^a-z0-9\s\-]/g, ' ') // remove punctuation
    .replace(/\s+/g, ' ') // collapse whitespace
    .trim();
};

async function loadCsv(): Promise<Map<string, IngredientInfo>> {
  if (cachedMap) return cachedMap;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    // Try to load a pre-generated JSON via dynamic import (bundled at build time).
    // This is the fastest option and avoids runtime CSV parsing or extra fetches.
    try {
      // Vite will include JSON imports in the bundle. Use dynamic import so it
      // resolves correctly in both dev and prod.
      // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = await import('../assets/dataset/ingredientsList.json');
      const data: Record<string, string>[] = (mod && (mod.default || mod)) as any;
      if (Array.isArray(data)) {
        const map = new Map<string, IngredientInfo>();
        for (const row of data) {
          const name = (row['name'] || '').toString().trim();
          if (!name) continue;
          const info: IngredientInfo = {
            name: name,
            scientific_name: row['scientific_name'] || undefined,
            short_description: row['short_description'] || undefined,
            what_is_it: row['what_is_it'] || undefined,
            what_does_it_do: row['what_does_it_do'] || undefined,
            who_is_it_good_for: row['who_is_it_good_for'] || undefined,
            who_should_avoid: row['who_should_avoid'] || undefined,
            url: row['url'] || undefined,
          };

          const key = normalizeName(name);
          if (!map.has(key)) map.set(key, info);

          const commaParts = name.split(/[,\/]/).map((p: string) => p.trim()).filter(Boolean);
          for (const p of commaParts) {
            const k = normalizeName(p);
            if (k && !map.has(k)) map.set(k, info);
          }
        }
        cachedMap = map;
        return map;
      }
    } catch (err) {
      // ignore and fall back to fetch/CSV parsing below
    }

    // Fallback: parse CSV at runtime (kept for compatibility if JSON isn't generated)
    const url = new URL('../../assets/dataset/ingredientsList.csv', import.meta.url).href;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch ingredients CSV');
    const text = await res.text();

    const parsed = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
    });

    const map = new Map<string, IngredientInfo>();

    for (const row of parsed.data) {
      const name = (row['name'] || '').trim();
      if (!name) continue;
      const info: IngredientInfo = {
        name: name,
        scientific_name: row['scientific_name'] || undefined,
        short_description: row['short_description'] || undefined,
        what_is_it: row['what_is_it'] || undefined,
        what_does_it_do: row['what_does_it_do'] || undefined,
        who_is_it_good_for: row['who_is_it_good_for'] || undefined,
        who_should_avoid: row['who_should_avoid'] || undefined,
        url: row['url'] || undefined,
      };

      const key = normalizeName(name);
      if (!map.has(key)) map.set(key, info);

      // also attempt to index common variations (split on comma or "/")
      const commaParts = name.split(/[,\/]/).map((p: string) => p.trim()).filter(Boolean);
      for (const p of commaParts) {
        const k = normalizeName(p);
        if (k && !map.has(k)) map.set(k, info);
      }
    }

    cachedMap = map;
    return map;
  })();

  return loadingPromise;
}

export async function getIngredientDetails(name: string): Promise<IngredientInfo | null> {
  if (!name) return null;
  const map = await loadCsv();
  const key = normalizeName(name);
  if (map.has(key)) return map.get(key)!;

  // try stripping percentages and extra chars
  const simplified = name.replace(/\d+%/g, '').replace(/[^a-zA-Z\s]/g, ' ');
  const k2 = normalizeName(simplified);
  if (map.has(k2)) return map.get(k2)!;

  return null;
}
