import initSqlJs from 'sql.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.resolve(__dirname, '../server/data/pixel_forge.db');

async function checkDb() {
  const SQL = await initSqlJs();
  if (!fs.existsSync(DB_PATH)) {
    console.error('Database file not found at:', DB_PATH);
    return;
  }
  const data = fs.readFileSync(DB_PATH);
  const db = new SQL.Database(data);
  
  const res = db.exec("SELECT name, slug, variants FROM products");
  console.log('--- PRODUCTS IN DB ---');
  if (res.length > 0) {
    res[0].values.forEach(row => {
      console.log(`Name: ${row[0]}, Slug: ${row[1]}`);
      console.log(`Variants: ${row[2]}`);
      console.log('----------------------');
    });
  } else {
    console.log('No products found.');
  }
}

checkDb().catch(console.error);
