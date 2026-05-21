const fs = require('fs');
const path = require('path');

const merges = [
    {
        src: "komakchilar/Ozbekiston/Andijon viloyati/Tulanboyev Shoxsuvor Dilmurod o_g_li",
        dest: "komakchilar/Ozbekiston/Andijon viloyati/Tulanboyev Shoxsuvor Dilmurod o'g'li"
    },
    {
        src: "komakchilar/Ozbekiston/Buxoro viloyati/Ergasheva Nasiba To_lqin",
        dest: "komakchilar/Ozbekiston/Buxoro viloyati/Ergasheva Nasiba To'lqin"
    },
    {
        src: "komakchilar/Ozbekiston/Buxoro viloyati/Gadoyev Doston Zokir o_g_li",
        dest: "komakchilar/Ozbekiston/Buxoro viloyati/Gadoyev Doston Zokir o'g'li"
    },
    {
        src: "komakchilar/Ozbekiston/Buxoro viloyati/Odilov Dilshodbek Dilmurod o_g_li",
        dest: "komakchilar/Ozbekiston/Buxoro viloyati/Odilov Dilshodbek Dilmurod o'g'li"
    },
    {
        src: "komakchilar/Ozbekiston/Sirdaryo viloyati/Abduraimov Usmonjon To_lqinjon o_g_li",
        dest: "komakchilar/Ozbekiston/Sirdaryo viloyati/Abduraimov Usmonjon To'lqinjon o'g'li"
    },
    {
        src: "komakchilar/Ozbekiston/Sirdaryo viloyati/Eshpo_latova Shoira Farhod qizi",
        dest: "komakchilar/Ozbekiston/Sirdaryo viloyati/Eshpo'latova Shoira Farhod qizi"
    },
    {
        src: "komakchilar/Ozbekiston/Sirdaryo viloyati/Sultonov Shohrux Xasan o_g_li",
        dest: "komakchilar/Ozbekiston/Sirdaryo viloyati/Sultonov Shohrux Xasan o'g'li"
    }
];

const qoraqalpogiston1 = "komakchilar/Ozbekiston/Qoraqalpog'iston/Imamiddinov Sardorbek Olimboy o'g'li";
const qoraqalpogiston2 = "komakchilar/Qoraqalpogiston/Imamiddinov Sardorbek Olimboy o'g'li";

if (fs.existsSync(qoraqalpogiston2) && fs.existsSync(qoraqalpogiston1)) {
    merges.push({ src: qoraqalpogiston2, dest: qoraqalpogiston1 });
}

for (const {src, dest} of merges) {
    if (fs.existsSync(src) && fs.existsSync(dest)) {
        console.log(`Merging:\n  [SRC]:  ${src}\n  [DEST]: ${dest}`);
        const files = fs.readdirSync(src);
        for (const file of files) {
            const srcFile = path.join(src, file);
            let destFile = path.join(dest, file);
            
            if (fs.statSync(srcFile).isFile()) {
                if (fs.existsSync(destFile)) {
                    const ext = path.extname(file);
                    const name = path.basename(file, ext);
                    destFile = path.join(dest, `${name}_copy${ext}`);
                }
                
                fs.copyFileSync(srcFile, destFile);
                fs.unlinkSync(srcFile);
                console.log(`    Moved file: ${file}`);
            }
        }
        try {
            fs.rmdirSync(src);
            console.log(`  Removed empty source folder: ${src}\n`);
        } catch(e) {
            console.log(`  Could not remove ${src}: ${e.message}\n`);
        }
    } else {
        console.log(`Skipping (not found):\n  [SRC]:  ${src}\n  [DEST]: ${dest}\n`);
    }
}
