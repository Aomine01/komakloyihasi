const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const DIR = path.resolve('public/assets/komakchilar');
const MAX_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_DIM = 1920;

async function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const fp = path.join(dir, e.name);
    if (e.isDirectory()) { await walk(fp); continue; }
    const ext = path.extname(e.name).toLowerCase();
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue;
    const stat = fs.statSync(fp);
    if (stat.size <= MAX_SIZE) continue;
    const sizeMB = (stat.size / 1024 / 1024).toFixed(1);
    try {
      const buf = await sharp(fp)
        .resize(MAX_DIM, MAX_DIM, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toBuffer();
      // Write to temp then rename (sharp can't overwrite in-place)
      const tmp = fp + '.tmp';
      fs.writeFileSync(tmp, buf);
      fs.unlinkSync(fp);
      fs.renameSync(tmp, fp);
      const newSize = (buf.length / 1024 / 1024).toFixed(1);
      console.log(`Compressed ${path.relative(DIR, fp)}: ${sizeMB}MB -> ${newSize}MB`);
    } catch(err) {
      console.error(`Skip ${e.name}: ${err.message}`);
    }
  }
}

walk(DIR).then(() => {
  // Final size report
  let total = 0;
  function count(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const fp = path.join(d, e.name);
      if (e.isDirectory()) { count(fp); } else { total += fs.statSync(fp).size; }
    }
  }
  count(DIR);
  console.log(`\nTotal size: ${(total / 1024 / 1024).toFixed(1)}MB`);
});
