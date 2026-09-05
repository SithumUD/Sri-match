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
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(path.join(__dirname, '../src/views'));
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Check if it already has use client
  if (!content.startsWith('"use client";') && !content.startsWith("'use client';")) {
    content = '"use client";\n\n' + content;
  }

  // Handle react-router-dom imports
  if (content.includes('react-router-dom')) {
    const match = content.match(/import\s*\{([^}]+)\}\s*from\s*['"]react-router-dom['"];?/);
    if (match) {
      const imports = match[1].split(',').map(s => s.trim());
      let nextImports = [];
      let nextNavImports = [];

      imports.forEach(imp => {
        if (imp === 'Link') {
          nextImports.push("import Link from 'next/link';");
        } else if (imp === 'useNavigate') {
          nextNavImports.push('useRouter');
        } else if (imp === 'useLocation') {
          nextNavImports.push('usePathname');
        } else if (imp === 'useParams') {
          nextNavImports.push('useParams');
        } else if (imp === 'useSearchParams') {
          nextNavImports.push('useSearchParams');
        }
      });

      let replacement = '';
      if (nextImports.length > 0) replacement += nextImports.join('\n') + '\n';
      if (nextNavImports.length > 0) replacement += `import { ${nextNavImports.join(', ')} } from 'next/navigation';\n`;

      content = content.replace(match[0], replacement.trim());
    }
  }

  // Replace useNavigate usages
  content = content.replace(/const\s+navigate\s*=\s*useNavigate\(\);?/g, 'const router = useRouter();');
  content = content.replace(/navigate\(/g, 'router.push(');

  // Replace useLocation usages
  content = content.replace(/const\s+location\s*=\s*useLocation\(\);?/g, 'const pathname = usePathname();');
  content = content.replace(/location\.pathname/g, 'pathname');

  // Replace <Link to= with <Link href=
  content = content.replace(/<Link\s+to=/g, '<Link href=');

  fs.writeFileSync(file, content, 'utf8');
  console.log('Converted', path.basename(file));
});
