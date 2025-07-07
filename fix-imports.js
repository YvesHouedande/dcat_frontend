import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.join(__dirname, 'src');
const SEARCH = /(['"])(\.\.\/)+interventions\/interface\//gi;
const REPLACE = (match, quote) => match.replace(/interventions\//i, 'Interventions/');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath, callback);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      callback(fullPath);
    }
  });
}

walk(ROOT_DIR, (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  if (SEARCH.test(content)) {
    const updated = content.replace(SEARCH, REPLACE);
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`✅ Corrigé : ${filePath}`);
  }
});
