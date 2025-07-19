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

const allFiles = scanDir(ROOT_DIR).filter(file =>
  !file.startsWith('.github/') && 
  !file.endsWith('index.json') && 
  !file.startsWith('node_modules/')
);

const result = {
  updatedAt: new Date().toISOString(),
  files: allFiles,
  byExtension: {}
};

for (const file of allFiles) {
  const ext = path.extname(file).slice(1); 
  if (!result.byExtension[ext]) {
    result.byExtension[ext] = [];
  }
  result.byExtension[ext].push(file);
}

const outputPath = path.join(ROOT_DIR, 'index.json');
fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));

console.log(`✅ index.json created with ${allFiles.length} files.`);
