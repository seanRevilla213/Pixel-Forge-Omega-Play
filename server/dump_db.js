const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

async function checkDb() {
  const SQL = await initSqlJs();
  const dbPath = path.join(__dirname, 'data/pixel_forge.db');
  const data = fs.readFileSync(dbPath);
  const db = new SQL.Database(data);
  
  const res = db.exec("SELECT id, name, slug, variants FROM products");
  console.log(JSON.stringify(res[0].values, null, 2));
}

checkDb().catch(console.error);
