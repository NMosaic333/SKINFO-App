#!/usr/bin/env node
import fs from 'fs/promises';
import Papa from 'papaparse';

const csvPath = 'src/assets/dataset/ingredientsList.csv';
const outPath = 'src/assets/dataset/ingredientsList.json';

async function main() {
  console.log('Reading CSV:', csvPath);
  const text = await fs.readFile(csvPath, 'utf8');
  console.log('Parsing CSV...');
  const parsed = Papa.parse(text, {
    header: true,
    skipEmptyLines: true,
  });

  if (parsed.errors && parsed.errors.length > 0) {
    console.warn('CSV parse warnings/errors:', parsed.errors.slice(0, 5));
  }

  const rows = parsed.data.map((row) => {
    // ensure string keys and trim
    const out = {};
    for (const k of Object.keys(row)) {
      const key = k ? String(k).trim() : '';
      out[key] = row[k];
    }
    return out;
  });

  console.log('Writing JSON to', outPath);
  await fs.writeFile(outPath, JSON.stringify(rows, null, 2), 'utf8');
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
