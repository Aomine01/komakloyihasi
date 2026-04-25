import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';
import WordExtractor from 'word-extractor';

// ─── Config ─────────────────────────────────────────────────────────────────

const SRC_DIR = path.resolve(process.cwd(), 'komakchilar', 'Ozbekiston');
const DEST_DIR = path.resolve(process.cwd(), 'public', 'assets', 'komakchilar');
const DATA_FILE = path.resolve(process.cwd(), 'komakchilar-data.json');

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);
const DOC_EXTS = new Set(['.doc', '.docx']);
const SKIP_FILES = new Set(['desktop.ini', '.ds_store', 'thumbs.db']);

const wordExtractor = new WordExtractor();

// ─── Slugify ─────────────────────────────────────────────────────────────────

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[''ʻ`']/g, '')   // Remove Uzbek apostrophe variants
    .replace(/[^a-z0-9\s-]/gi, '') // Remove non-alphanumeric (keeps spaces and hyphens)
    .trim()
    .replace(/\s+/g, '-')       // Spaces to hyphens
    .replace(/-+/g, '-')        // Collapse multiple hyphens
    .replace(/^-|-$/g, '');     // Trim leading/trailing hyphens
}

// ─── Copy file helper ────────────────────────────────────────────────────────

function copyFile(src: string, dest: string): void {
  const dir = path.dirname(dest);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(src, dest);
}

// ─── Read .doc/.docx ─────────────────────────────────────────────────────────

async function readDocFile(filePath: string): Promise<string | null> {
  const ext = path.extname(filePath).toLowerCase();
  
  try {
    if (ext === '.docx') {
      // Use mammoth for .docx
      const buffer = fs.readFileSync(filePath);
      const result = await mammoth.extractRawText({ buffer });
      const text = result.value.trim();
      if (!text || text.length < 5) return null;
      return text;
    } else {
      // Use word-extractor for .doc (old binary format)
      const extracted = await wordExtractor.extract(filePath);
      const text = extracted.getBody().trim();
      if (!text || text.length < 5) return null;
      return text;
    }
  } catch (err) {
    console.error(`  ⚠ Could not read doc: ${path.basename(filePath)} — ${(err as Error).message}`);
    return null;
  }
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface PersonData {
  name: string;
  slug: string;
  featured: boolean;
  description: string | null;
  images: string[];          // sequential filenames: ["1.jpg", "2.jpg", ...]
  originalImages: string[];  // original filenames
  imagePath: string;         // URL path: /assets/komakchilar/viloyat-slug/person-slug/
}

interface ViloyatData {
  name: string;
  slug: string;
  people: PersonData[];
}

interface KomakchilarData {
  viloyatlar: ViloyatData[];
}

// ─── Main Pipeline ───────────────────────────────────────────────────────────

async function main() {
  console.log('╔═══════════════════════════════════════════════════╗');
  console.log('║   Ko\'makchilar Builder — Full Pipeline            ║');
  console.log('╚═══════════════════════════════════════════════════╝\n');

  // Clean destination
  if (fs.existsSync(DEST_DIR)) {
    fs.rmSync(DEST_DIR, { recursive: true, force: true });
    console.log('🧹 Cleaned previous output directory.\n');
  }
  fs.mkdirSync(DEST_DIR, { recursive: true });

  // Scan viloyat directories
  const viloyatDirs = fs.readdirSync(SRC_DIR)
    .filter(d => fs.statSync(path.join(SRC_DIR, d)).isDirectory())
    .sort();

  const data: KomakchilarData = { viloyatlar: [] };

  let totalPeople = 0;
  let totalImages = 0;
  let totalFeatured = 0;
  let totalSkippedPeople = 0;

  for (const viloyatName of viloyatDirs) {
    const viloyatPath = path.join(SRC_DIR, viloyatName);
    // Clean viloyat name (remove " viloyati" suffix for display if wanted, keep full for name)
    const vilSlug = slugify(viloyatName.replace(/ viloyati$/i, ''));
    
    console.log(`\n━━━ VILOYAT: ${viloyatName} (slug: ${vilSlug}) ━━━`);

    const viloyat: ViloyatData = {
      name: viloyatName,
      slug: vilSlug,
      people: [],
    };

    // Scan person directories
    const personDirs = fs.readdirSync(viloyatPath)
      .filter(d => fs.statSync(path.join(viloyatPath, d)).isDirectory())
      .sort();

    if (personDirs.length === 0) {
      console.log('  (empty viloyat — no people)');
      data.viloyatlar.push(viloyat);
      continue;
    }

    // Track slugs for duplicate detection
    const usedSlugs = new Set<string>();

    for (const personFolderName of personDirs) {
      const personPath = path.join(viloyatPath, personFolderName);

      // Clean person name: remove underscores, remove trailing viloyat info after comma
      let personName = personFolderName
        .replace(/_/g, ' ')
        .trim();
      // Remove ", Viloyat name" suffix if present
      personName = personName.replace(/,\s*\w+\s+viloyati$/i, '').trim();

      // Generate slug with duplicate handling
      let personSlug = slugify(personName);
      if (!personSlug) personSlug = 'person';
      if (usedSlugs.has(personSlug)) {
        let counter = 2;
        while (usedSlugs.has(`${personSlug}-${counter}`)) counter++;
        personSlug = `${personSlug}-${counter}`;
      }
      usedSlugs.add(personSlug);

      // Scan files
      const allFiles = fs.readdirSync(personPath);
      const imageFiles: string[] = [];
      const docFiles: string[] = [];

      for (const fileName of allFiles) {
        if (SKIP_FILES.has(fileName.toLowerCase())) continue;
        const ext = path.extname(fileName).toLowerCase();
        const filePath = path.join(personPath, fileName);
        const stat = fs.statSync(filePath);
        if (stat.size === 0) {
          console.log(`  ⚠ Skipping 0-byte file: ${fileName}`);
          continue;
        }
        if (IMAGE_EXTS.has(ext)) {
          imageFiles.push(fileName);
        } else if (DOC_EXTS.has(ext)) {
          docFiles.push(fileName);
        }
      }

      // Skip person with 0 images
      if (imageFiles.length === 0) {
        console.log(`  ⚠ SKIPPING (0 images): ${personName}`);
        totalSkippedPeople++;
        continue;
      }

      // Sort images naturally
      imageFiles.sort((a, b) => {
        const numA = parseInt(a.match(/(\d+)/)?.[1] ?? '0');
        const numB = parseInt(b.match(/(\d+)/)?.[1] ?? '0');
        return numA - numB;
      });

      // Step 2: Read description from .doc
      let description: string | null = null;
      if (docFiles.length > 0) {
        const docPath = path.join(personPath, docFiles[0]);
        description = await readDocFile(docPath);
      }

      const featured = description !== null && description.length > 0;

      // Step 3: Copy images
      const destPersonDir = path.join(DEST_DIR, vilSlug, personSlug);
      fs.mkdirSync(destPersonDir, { recursive: true });
      
      const sequentialNames: string[] = [];
      for (let i = 0; i < imageFiles.length; i++) {
        const origName = imageFiles[i];
        const ext = path.extname(origName).toLowerCase();
        const seqName = `${i + 1}${ext}`;
        sequentialNames.push(seqName);

        const srcPath = path.join(personPath, origName);
        const destPath = path.join(destPersonDir, seqName);
        copyFile(srcPath, destPath);
      }

      const imagePath = `/assets/komakchilar/${vilSlug}/${personSlug}/`;

      const person: PersonData = {
        name: personName,
        slug: personSlug,
        featured,
        description,
        images: sequentialNames,
        originalImages: imageFiles,
        imagePath,
      };

      viloyat.people.push(person);
      totalPeople++;
      totalImages += imageFiles.length;
      if (featured) totalFeatured++;

      console.log(`  ✅ ${personName} — ${imageFiles.length} images, ${featured ? 'FEATURED' : 'no desc'}`);
    }

    // Sort: featured first, then by name
    viloyat.people.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return a.name.localeCompare(b.name);
    });

    data.viloyatlar.push(viloyat);
  }

  // Step 6: Write data JSON
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`\n📄 Wrote ${DATA_FILE}`);

  // Summary
  console.log('\n╔═══════════════════════════════════════════════════╗');
  console.log('║   FINAL INVENTORY SUMMARY                        ║');
  console.log('╠═══════════════════════════════════════════════════╣');
  console.log(`║  Viloyatlar:      ${data.viloyatlar.length.toString().padStart(4)}`);
  console.log(`║  Total People:    ${totalPeople.toString().padStart(4)}`);
  console.log(`║  Featured:        ${totalFeatured.toString().padStart(4)} (with description)`);
  console.log(`║  Non-featured:    ${(totalPeople - totalFeatured).toString().padStart(4)}`);
  console.log(`║  Total Images:    ${totalImages.toString().padStart(4)}`);
  console.log(`║  Skipped People:  ${totalSkippedPeople.toString().padStart(4)} (0 images)`);
  console.log('╚═══════════════════════════════════════════════════╝');

  // Per-viloyat summary
  console.log('\nPer-viloyat breakdown:');
  for (const v of data.viloyatlar) {
    const feat = v.people.filter(p => p.featured).length;
    const imgs = v.people.reduce((sum, p) => sum + p.images.length, 0);
    console.log(`  ${v.name.padEnd(25)} — ${v.people.length} people (${feat} featured), ${imgs} images`);
  }
}

main().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
