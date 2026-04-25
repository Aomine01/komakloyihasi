import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';
// @ts-ignore
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
    .replace(/[''ʻ`']/g, '')
    .replace(/[^a-z0-9\s-]/gi, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
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
      const buffer = fs.readFileSync(filePath);
      const result = await mammoth.extractRawText({ buffer });
      const text = result.value.trim();
      if (!text || text.length < 5) return null;
      return text;
    } else {
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
  images: string[];
  originalImages: string[];
  imagePath: string;
}

interface ViloyatData {
  name: string;
  slug: string;
  people: PersonData[];
}

interface KomakchilarData {
  viloyatlar: ViloyatData[];
}

// ─── Main Sync Pipeline ──────────────────────────────────────────────────────
async function main() {
  console.log("╔═══════════════════════════════════════════════════╗");
  console.log("║   Ko'makchilar Syncer — Differential Update      ║");
  console.log("╚═══════════════════════════════════════════════════╝\n");

  // Load existing data
  if (!fs.existsSync(DATA_FILE)) {
    console.error('❌ Data file not found:', DATA_FILE);
    process.exit(1);
  }

  const rawData = fs.readFileSync(DATA_FILE, 'utf-8');
  const data: KomakchilarData = JSON.parse(rawData);

  // Helper to find viloyat by slug
  const getViloyatBySlug = (slug: string) => data.viloyatlar.find(v => v.slug === slug);
  // Helper to find person by original dir name. 
  // We can't rely just on slug because there might be collisions or changes. 
  // The instruction says "people whose folder slug does not exist in the JSON yet". 
  // Let's use personSlug to check existence.

  const viloyatDirs = fs.readdirSync(SRC_DIR)
    .filter(d => fs.statSync(path.join(SRC_DIR, d)).isDirectory())
    .sort();

  let diffCount = 0;
  const newEntriesLog: string[] = [];

  for (const viloyatName of viloyatDirs) {
    const viloyatPath = path.join(SRC_DIR, viloyatName);
    const vilSlug = slugify(viloyatName.replace(/ viloyati$/i, ''));
    
    let viloyatData = getViloyatBySlug(vilSlug);
    let isNewViloyat = false;
    
    if (!viloyatData) {
      viloyatData = {
        name: viloyatName,
        slug: vilSlug,
        people: [],
      };
      isNewViloyat = true;
    }

    const usedSlugs = new Set<string>(viloyatData.people.map(p => p.slug));

    const personDirs = fs.readdirSync(viloyatPath)
      .filter(d => fs.statSync(path.join(viloyatPath, d)).isDirectory())
      .sort();

    for (const personFolderName of personDirs) {
      const personPath = path.join(viloyatPath, personFolderName);

      let personName = personFolderName
        .replace(/_/g, ' ')
        .trim();
      personName = personName.replace(/,\s*\w+\s+viloyati$/i, '').trim();

      // We need to know if this person is new or existing. 
      // The instruction: "people whose folder slug does not exist in the JSON yet"
      // Let's calculate their base slug.
      let baseSlug = slugify(personName);
      if (!baseSlug) baseSlug = 'person';
      
      // Let's check if there's an exact name match or if their slug is already in the usedSlugs 
      // Actually, if we just check if any person in JSON has this exact `name` or `slug` matching `baseSlug`.
      // It's safer to check if `name` matches or `slug` matches.
      
      const existingPerson = viloyatData.people.find(p => p.slug === baseSlug || p.name === personName);

      const allFiles = fs.readdirSync(personPath);
      const imageFiles: string[] = [];
      const docFiles: string[] = [];

      for (const fileName of allFiles) {
        if (SKIP_FILES.has(fileName.toLowerCase())) continue;
        const ext = path.extname(fileName).toLowerCase();
        const filePath = path.join(personPath, fileName);
        const stat = fs.statSync(filePath);
        if (stat.size === 0) continue;
        
        if (IMAGE_EXTS.has(ext)) imageFiles.push(fileName);
        else if (DOC_EXTS.has(ext)) docFiles.push(fileName);
      }

      if (imageFiles.length === 0) continue;

      imageFiles.sort((a, b) => {
        const numA = parseInt(a.match(/(\d+)/)?.[1] ?? '0');
        const numB = parseInt(b.match(/(\d+)/)?.[1] ?? '0');
        return numA - numB;
      });

      if (!existingPerson) {
        // NEW PERSON
        diffCount++;
        
        let personSlug = baseSlug;
        if (usedSlugs.has(personSlug)) {
          let counter = 2;
          while (usedSlugs.has(`${personSlug}-${counter}`)) counter++;
          personSlug = `${personSlug}-${counter}`;
        }
        usedSlugs.add(personSlug);

        let description: string | null = null;
        if (docFiles.length > 0) {
          const docPath = path.join(personPath, docFiles[0]);
          description = await readDocFile(docPath);
        }

        const featured = description !== null && description.length > 0;

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

        const newPerson: PersonData = {
          name: personName,
          slug: personSlug,
          featured,
          description,
          images: sequentialNames,
          originalImages: imageFiles,
          imagePath,
        };

        viloyatData.people.push(newPerson);
        newEntriesLog.push(`  - ${viloyatName} → ${personName} (${imageFiles.length} images, ${featured ? 'HAS description' : 'no description'})`);
        
        if (isNewViloyat) {
          data.viloyatlar.push(viloyatData);
          isNewViloyat = false; // Added to array, so it's not new anymore
        }
      } else {
        // EXISTING PERSON - check edge cases
        // 1. New images added?
        // 2. Doc added?
        
        let updated = false;
        
        if (docFiles.length > 0 && (!existingPerson.description || !existingPerson.featured)) {
          const docPath = path.join(personPath, docFiles[0]);
          const newDesc = await readDocFile(docPath);
          if (newDesc && newDesc.length > 0) {
            existingPerson.description = newDesc;
            existingPerson.featured = true;
            updated = true;
            newEntriesLog.push(`  - ${viloyatName} → ${personName} (UPDATED: Document added)`);
          }
        }
        
        // If image files count is different, let's update images
        // Compare originalImages array length
        if (existingPerson.originalImages.length !== imageFiles.length) {
          const destPersonDir = path.join(DEST_DIR, vilSlug, existingPerson.slug);
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
          existingPerson.images = sequentialNames;
          existingPerson.originalImages = imageFiles;
          updated = true;
          newEntriesLog.push(`  - ${viloyatName} → ${personName} (UPDATED: Images changed from ${existingPerson.originalImages.length} to ${imageFiles.length})`);
        }
        
        if (updated) {
          diffCount++;
        }
      }
    }
  }

  if (diffCount === 0) {
    console.log('Nothing new to sync.');
    return;
  }

  console.log('NEW entries found:');
  newEntriesLog.forEach(log => console.log(log));
  console.log(`Total: ${diffCount} updates processed.`);

  // Sort and save
  for (const viloyat of data.viloyatlar) {
    viloyat.people.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return a.name.localeCompare(b.name);
    });
  }
  
  // Sort viloyatlar
  data.viloyatlar.sort((a, b) => a.name.localeCompare(b.name));

  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`\n📄 Wrote ${DATA_FILE}`);
}

main().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
