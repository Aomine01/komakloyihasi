const fs = require('fs');
const raw = fs.readFileSync('komakchilar-data.json', 'utf8');
const data = JSON.parse(raw.replace(/^\uFEFF/, ''));
const names = {};
const slugs = {};

data.viloyatlar.forEach(v => {
    v.people.forEach(p => {
        // Check exact name
        if (names[p.name]) {
            names[p.name].push(v.name);
        } else {
            names[p.name] = [v.name];
        }
        
        // Check slug to catch variations in case/spacing
        if (slugs[p.slug]) {
            slugs[p.slug].push(v.name);
        } else {
            slugs[p.slug] = [v.name];
        }
    });
});

let found = false;
console.log('--- Duplicate Names ---');
for (const [name, vils] of Object.entries(names)) {
    if (vils.length > 1) {
        console.log(`Duplicate Name: "${name}" found in [${vils.join(', ')}]`);
        found = true;
    }
}

console.log('\n--- Duplicate Slugs (Similar Names) ---');
for (const [slug, vils] of Object.entries(slugs)) {
    if (vils.length > 1) {
        console.log(`Duplicate Slug: "${slug}" found in [${vils.join(', ')}]`);
        found = true;
    }
}

if (!found) {
    console.log('No duplicates found!');
}
