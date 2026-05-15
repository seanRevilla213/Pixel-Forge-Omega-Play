const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

async function checkDb() {
  const SQL = await initSqlJs();
  const dbPath = path.join(__dirname, 'server/data/pixel_forge.db');
  const data = fs.readFileSync(dbPath);
  const db = new SQL.Database(data);
  
  const res = db.exec("SELECT variants FROM products WHERE slug = 'xbox-360-wireless-controller'");
  console.log(JSON.stringify(res, null, 2));
}

checkDb();
