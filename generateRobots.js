const fs = require('fs');

const content = `User-agent: *
Disallow: /
`;

fs.writeFileSync('robots.txt', content);
console.log('✅ robots.txt created and disallows all crawlers.');
