const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'src'));
files.forEach((file) => {
  let content = fs.readFileSync(file, 'utf-8');
  let changed = false;

  // Fix fontWeight={700} -> sx={{ fontWeight: 700 }}
  if (content.includes('fontWeight={700}')) {
    content = content.replace(/fontWeight={700}/g, 'sx={{ fontWeight: 700 }}');
    changed = true;
  }

  // Remove unused Box imports where Box is imported but not used
  // Just a simple regex for Box, Typography if Box is unused
  if (content.includes('import { Box, Typography } from \'@mui/material\';') && !content.includes('<Box')) {
    content = content.replace('import { Box, Typography } from \'@mui/material\';', 'import { Typography } from \'@mui/material\';');
    changed = true;
  }
  if (content.includes('import { Box, Typography, Container } from \'@mui/material\';') && !content.includes('<Box')) {
    content = content.replace('import { Box, Typography, Container } from \'@mui/material\';', 'import { Typography, Container } from \'@mui/material\';');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf-8');
    console.log('Fixed', file);
  }
});
