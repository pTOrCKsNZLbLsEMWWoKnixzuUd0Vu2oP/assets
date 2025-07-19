const fs = require('fs');
const path = require('path');

// 루트 디렉터리 (예: './assets')
const ROOT_DIR = './assets';

// 재귀적으로 디렉터리를 탐색하며 파일 경로 수집
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

// 실행
const allFiles = scanDir(ROOT_DIR);

// 결과 구조화 (확장자별 그룹핑 예시 포함)
const result = {
  updatedAt: new Date().toISOString(),
  files: allFiles,
  byExtension: {}
};

// 선택적으로 확장자별 그룹핑도 추가
for (const file of allFiles) {
  const ext = path.extname(file).slice(1); // 'png', 'gif' 등
  if (!result.byExtension[ext]) {
    result.byExtension[ext] = [];
  }
  result.byExtension[ext].push(file);
}

// index.json 저장
const outputPath = path.join(ROOT_DIR, 'index.json');
fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));

console.log(`✅ index.json created with ${allFiles.length} files.`);
