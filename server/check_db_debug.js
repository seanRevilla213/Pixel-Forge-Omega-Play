const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

async function checkDb() {
  const SQL = await initSqlJs();
  const dbPath = path.join(__dirname, 'data/pixel_forge.db');
  if (!fs.existsSync(dbPath)) {
    console.error('DB file not found at:', dbPath);
    return;
  }
  const data = fs.readFileSync(dbPath);
  const db = new SQL.Database(data);
  
  const res = db.exec("SELECT variants FROM products WHERE slug = 'xbox-360-wireless-controller'");
  if (res.length > 0 && res[0].values.length > 0) {
    console.log('VARIANTS_START');
    console.log(res[0].values[0][0]);
    console.log('VARIANTS_END');
  } else {
    console.log('No variants found for this slug');
  }
}

checkDb().catch(console.error);
