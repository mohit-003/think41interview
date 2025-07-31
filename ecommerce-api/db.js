const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '12345678',
  database: 'thk41',
  waitForConnections: true,
  connectionLimit: 10
});

module.exports = pool.promise();
