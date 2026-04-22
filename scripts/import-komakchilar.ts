/**
 * import-komakchilar.ts
 *
 * This script:
 * 1. Reads the `komakchilar/` folder structure (Ozbekiston -> Viloyat -> Person)
 * 2. Copies all images/docs to `public/komakchilar/`
 * 3. Adds gallery_urls / document_urls columns to the DB if they don't exist
 * 4. Finds the matching viloyat in the DB and inserts each person as a project
 *
 * Usage: npx tsx scripts/import-komakchilar.ts
 */

import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

// ─── Config ─────────────────────────────────────────────────────────────────

const KOMAKCHILAR_DIR = path.resolve(process.cwd(), 'komakchilar');
const PUBLIC_DIR = path.resolve(process.cwd(), 'public', 'komakchilar');
const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);
const DOC_EXTS = new Set(['.doc', '.docx', '.pdf']);

// ─── Helpers ─────────────────────────────────────────────────────────────────

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[''`]/g, '')
    .replace(/[^a-z0-9\u0400-\u04ff]+/gi, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 80);
}

function safeDirName(str: string): string {
  // Replace chars that are unsafe for filesystem/URLs
  return str.replace(/[<>:"/\\|?*]/g, '_').trim();
}

function copyFile(src: string, dest: string) {
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(src, dest);
}

function readPersonFolder(folderPath: string): { images: string[]; docs: string[] } {
  const files = fs.readdirSync(folderPath);
  const images: string[] = [];
  const docs: string[] = [];

  for (const file of files) {
    if (file.toLowerCase() === 'desktop.ini') continue;
    const ext = path.extname(file).toLowerCase();
    if (IMAGE_EXTS.has(ext)) images.push(path.join(folderPath, file));
    else if (DOC_EXTS.has(ext)) docs.push(path.join(folderPath, file));
  }

  return { images, docs };
}

// ─── Viloyat name → slug mapping (matches seed.ts) ──────────────────────────

const viloyatSlugMap: Record<string, string> = {
  'andijon viloyati': 'andijon',
  'buxoro viloyati': 'buxoro',
  "farg'ona viloyati": 'fargona',
  'fargona viloyati': 'fargona',
  'jizzax viloyati': 'jizzax',
  'xorazm viloyati': 'xorazm',
  'namangan viloyati': 'namangan',
  'navoiy viloyati': 'navoiy',
  'qashqadaryo viloyati': 'qashqadaryo',
  "qoraqalpog'iston": 'qoraqalpogiston',
  'qoraqalpogiston': 'qoraqalpogiston',
  'samarqand viloyati': 'samarqand',
  'sirdaryo viloyati': 'sirdaryo',
  'surxondaryo viloyati': 'surxondaryo',
  'toshkent viloyati': 'toshkent-viloyat',
  'toshkent shahri': 'toshkent-shahar',
};

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    multipleStatements: true,
  });

  // 1. Ensure columns exist
  console.log('📦 Adding gallery_urls / document_urls columns if needed...');
  await pool.execute(`
    ALTER TABLE projects
    ADD COLUMN IF NOT EXISTS gallery_urls JSON NULL,
    ADD COLUMN IF NOT EXISTS document_urls JSON NULL
  `);
  console.log('✅ Columns ready.');

  // 2. Ensure public/komakchilar dir exists
  if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true });

  // 3. Scan folder structure
  const rootEntries = fs.readdirSync(KOMAKCHILAR_DIR);

  let inserted = 0;
  let skipped = 0;

  for (const regionGroup of rootEntries) {
    // regionGroup is "Ozbekiston" or "Qoraqalpogiston"
    const regionGroupPath = path.join(KOMAKCHILAR_DIR, regionGroup);
    if (!fs.statSync(regionGroupPath).isDirectory()) continue;

    const viloyatDirs = fs.readdirSync(regionGroupPath);

    for (const viloyatName of viloyatDirs) {
      const viloyatPath = path.join(regionGroupPath, viloyatName);
      if (!fs.statSync(viloyatPath).isDirectory()) continue;

      // Find viloyat in DB
      const vilSlug = viloyatSlugMap[viloyatName.toLowerCase()] ?? slugify(viloyatName);
      const [vilRows] = await pool.execute<mysql.RowDataPacket[]>(
        'SELECT id FROM viloyatlar WHERE slug = ?',
        [vilSlug]
      );

      if (!vilRows.length) {
        console.warn(`⚠  Viloyat not found in DB for slug "${vilSlug}" (folder: "${viloyatName}") — skipping`);
        continue;
      }
      const viloyatId = vilRows[0].id as string;

      // Get first tuman of this viloyat (we'll assign person to the viloyat's first tuman)
      const [tumanRows] = await pool.execute<mysql.RowDataPacket[]>(
        'SELECT id FROM tumanlar WHERE viloyat_id = ? LIMIT 1',
        [viloyatId]
      );
      const tumanId = tumanRows.length ? (tumanRows[0].id as string) : null;

      // Iterate person folders
      const personDirs = fs.readdirSync(viloyatPath);

      for (const personFolderName of personDirs) {
        const personPath = path.join(viloyatPath, personFolderName);
        if (!fs.statSync(personPath).isDirectory()) continue;

        // Clean person name: replace underscores with spaces
        const ownerName = personFolderName.replace(/_/g, ' ').trim();
        const title = `${ownerName} — O'quv markazi`;
        const safePerson = safeDirName(personFolderName);
        const safeViloyat = safeDirName(viloyatName);

        // Check for duplicate
        const [existing] = await pool.execute<mysql.RowDataPacket[]>(
          'SELECT id FROM projects WHERE owner_name = ? LIMIT 1',
          [ownerName]
        );
        if (existing.length) {
          console.log(`  ↪ Skipping (already exists): ${ownerName}`);
          skipped++;
          continue;
        }

        // Read files
        const { images, docs } = readPersonFolder(personPath);

        // Copy files to public
        const publicPersonDir = path.join(PUBLIC_DIR, safeViloyat, safePerson);
        const galleryUrls: string[] = [];
        const documentUrls: string[] = [];

        for (const imgPath of images) {
          const fileName = path.basename(imgPath);
          const dest = path.join(publicPersonDir, fileName);
          copyFile(imgPath, dest);
          // URL path (relative to /public)
          galleryUrls.push(`/komakchilar/${encodeURIComponent(safeViloyat)}/${encodeURIComponent(safePerson)}/${encodeURIComponent(fileName)}`);
        }

        for (const docPath of docs) {
          const fileName = path.basename(docPath);
          const dest = path.join(publicPersonDir, fileName);
          copyFile(docPath, dest);
          documentUrls.push(`/komakchilar/${encodeURIComponent(safeViloyat)}/${encodeURIComponent(safePerson)}/${encodeURIComponent(fileName)}`);
        }

        const photoUrl = galleryUrls[0] ?? null;

        await pool.execute(
          `INSERT INTO projects
            (id, tuman_id, title, owner_name, photo_url, gallery_urls, document_urls, is_published, created_at)
           VALUES (UUID(), ?, ?, ?, ?, ?, ?, true, NOW())`,
          [
            tumanId,
            title,
            ownerName,
            photoUrl,
            JSON.stringify(galleryUrls),
            JSON.stringify(documentUrls),
          ]
        );

        console.log(`  ✅ Inserted: ${ownerName} (${viloyatName}) — ${galleryUrls.length} image(s), ${documentUrls.length} doc(s)`);
        inserted++;
      }
    }
  }

  console.log(`\n🎉 Done! Inserted: ${inserted}, Skipped (already exist): ${skipped}`);
  await pool.end();
}

main().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});
