const fs = require('fs');
const path = require('path');

const Database = require('better-sqlite3');


/* =========================================================
   DATABASE LOCATION
========================================================= */

const DATA_DIR = path.join(
  __dirname,
  '..',
  'data'
);

fs.mkdirSync(DATA_DIR, {
  recursive: true
});


const DB_PATH = path.join(
  DATA_DIR,
  'nestlink.db'
);


/* =========================================================
   DATABASE CONNECTION
========================================================= */

const db = new Database(DB_PATH);


/* =========================================================
   SQLITE CONFIGURATION
========================================================= */

db.pragma('foreign_keys = ON');

db.pragma('journal_mode = WAL');

db.pragma('busy_timeout = 5000');


/* =========================================================
   QUERY HELPERS
========================================================= */

const all = (sql, params = []) => {
  return db
    .prepare(sql)
    .all(...params);
};


const one = (sql, params = []) => {
  return db
    .prepare(sql)
    .get(...params);
};


const run = (sql, params = []) => {
  return db
    .prepare(sql)
    .run(...params);
};


/* =========================================================
   TRANSACTIONS

   Usage:

   tx(() => {
     run(...);
     run(...);
   });

   If any query fails, SQLite rolls back the entire operation.
========================================================= */

const tx = fn => {
  return db.transaction(fn)();
};


/* =========================================================
   SAFE TRANSACTION HELPER WITH RETURN VALUE

   Useful for maintenance workflows where we need to:
   - forward report
   - update status
   - create notification
   - create email record

   as one atomic operation.
========================================================= */

const transaction = fn => {
  return db.transaction(fn);
};


/* =========================================================
   DATABASE HEALTH CHECK
========================================================= */

const healthCheck = () => {

  try {

    const result = db
      .prepare(`
        SELECT
          1 AS healthy,
          datetime('now') AS database_time
      `)
      .get();

    return {
      healthy: result.healthy === 1,
      databaseTime: result.database_time,
      path: DB_PATH
    };

  } catch (error) {

    return {
      healthy: false,
      error: error.message,
      path: DB_PATH
    };

  }
};


/* =========================================================
   EXPORTS
========================================================= */

module.exports = {

  db,

  DB_PATH,

  all,

  one,

  run,

  tx,

  transaction,

  healthCheck

};