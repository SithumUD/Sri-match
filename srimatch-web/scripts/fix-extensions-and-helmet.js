const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx')) {
      results.push(file);
    }
  });
  return results;
}

// 1. Remove helmet and clean files
const allFiles = walk(path.join(__dirname, '../src'));
allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Remove react-helmet-async
  content = content.replace(/import\s*\{\s*Helmet\s*\}\s*from\s*['"]react-helmet-async['"];?/g, '');
  content = content.replace(/<Helmet>[\s\S]*?<\/Helmet>/g, '');

  fs.writeFileSync(file, content, 'utf8');

  // Rename .jsx to .tsx
  const newPath = file.slice(0, -4) + '.tsx';
  fs.renameSync(file, newPath);
  console.log(`Renamed ${path.basename(file)} -> ${path.basename(newPath)}`);
});

console.log('All files converted to .tsx and Helmet cleaned up!');
