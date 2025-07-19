const fs = require('fs');
const path = require('path');

const ROOT_DIR = '.';

function scanDir(currentPath, fileList = []) {
  const entries = fs.readdirSync(currentPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(currentPath, entry.name);

    if (entry.isDirectory()) {
      scanDir(fullPath, fileList);
    } else if (entry.isFile()) {
      const relativePath = path.relative(ROOT_DIR, fullPath).replace(/\\/g, '/');
      fileList.push(relativePath);
    }
  }

  return fileList;
}

const scannedFiles = scanDir(ROOT_DIR);

const isExcluded = (file) =>
  file.startsWith('.github/') ||
  file.startsWith('node_modules/') ||
  file === 'index.json';

const filteredFiles = scannedFiles.filter(file => !isExcluded(file));

const result = {
  updatedAt: new Date().toISOString(),
  files: filteredFiles,
  byExtension: {}
};

for (const file of filteredFiles) {
  const ext = path.extname(file).slice(1);
  if (!ext) continue;
  if (!result.byExtension[ext]) {
    result.byExtension[ext] = [];
  }
  result.byExtension[ext].push(file);
}

const outputPath = path.join(ROOT_DIR, 'index.json');
fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));

console.log(`✅ index.json created with ${filteredFiles.length} files.`);
