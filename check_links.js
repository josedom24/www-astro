const fs = require('fs');
const path = require('path');
const glob = require('glob');

const mdFiles = glob.sync('apps/fp/src/content/**/*.md');
const brokenLinks = [];

mdFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    const linkText = match[1];
    const linkPath = match[2];

    // Solo verificar enlaces locales (sin http, sin #)
    if (!linkPath.startsWith('http') && !linkPath.startsWith('#') && !linkPath.startsWith('/')) {
      const dir = path.dirname(file);
      const fullPath = path.resolve(dir, linkPath.replace(/\/$/, '').replace(/\.html$/, '.md'));
      
      // Verificar si el archivo existe
      if (!fs.existsSync(fullPath)) {
        brokenLinks.push({
          file: file.replace('apps/fp/src/content/', ''),
          link: linkPath,
          linkText: linkText,
          resolvedPath: fullPath.replace(path.resolve('apps/fp/src/content/'), '')
        });
      }
    }
  }
});

if (brokenLinks.length === 0) {
  console.log('✅ No se encontraron enlaces rotos');
} else {
  console.log(`❌ Se encontraron ${brokenLinks.length} enlaces rotos:\n`);
  brokenLinks.forEach(link => {
    console.log(`📄 ${link.file}`);
    console.log(`   Texto: "${link.linkText}"`);
    console.log(`   Enlace: ${link.link}`);
    console.log(`   Ruta buscada: ${link.resolvedPath}`);
    console.log('');
  });
}
