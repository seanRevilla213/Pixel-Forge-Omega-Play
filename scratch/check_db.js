const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

async function checkDb() {
  const SQL = await initSqlJs();
  const dbPath = path.resolve(__dirname, '../server/data/pixel_forge.db');
  if (!fs.existsSync(dbPath)) {
    console.error('Database file not found at:', dbPath);
    return;
  }
  const data = fs.readFileSync(dbPath);
  const db = new SQL.Database(data);
  
  const res = db.exec("SELECT name, slug, variants FROM products");
  console.log('--- PRODUCTS IN DB ---');
  res[0].values.forEach(row => {
    console.log(`Name: ${row[0]}, Slug: ${row[1]}`);
    console.log(`Variants: ${row[2]}`);
    console.log('----------------------');
  });
}

checkDb().catch(console.error);
