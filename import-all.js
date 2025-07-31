const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mysql = require('mysql2');

// Create MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345678',
  database: 'thk41'
});

const files = [
  {
    name: 'distribution_centers.csv',
    table: 'distribution_centers',
    columns: ['id', 'name', 'latitude', 'longitude']
  },
  {
    name: 'inventory_items.csv',
    table: 'inventory_items',
    columns: [
      'id', 'product_id', 'created_at', 'sold_at', 'cost',
      'product_category', 'product_name', 'product_brand',
      'product_retail_price', 'product_department', 'product_sku',
      'product_distribution_center_id'
    ]
  },
  {
    name: 'order_items.csv',
    table: 'order_items',
    columns: [
      'id', 'order_id', 'user_id', 'product_id', 'inventory_item_id',
      'status', 'created_at', 'shipped_at', 'delivered_at', 'returned_at'
    ]
  },
  {
    name: 'orders.csv',
    table: 'orders',
    columns: [
      'order_id', 'user_id', 'status', 'gender', 'created_at',
      'returned_at', 'shipped_at', 'delivered_at', 'num_of_item'
    ]
  },
  {
    name: 'products.csv',
    table: 'products',
    columns: [
      'id', 'cost', 'category', 'name', 'brand', 'retail_price',
      'department', 'sku', 'distribution_center_id'
    ]
  },
  {
    name: 'users.csv',
    table: 'users',
    columns: [
      'id', 'first_name', 'last_name', 'email', 'age', 'gender', 'state',
      'street_address', 'postal_code', 'city', 'country', 'latitude',
      'longitude', 'traffic_source', 'created_at'
    ]
  }
];

// Stream and insert each row
const importCSV = ({ name, table, columns }) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, 'data', name);
    let count = 0;

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        count++;
        const values = columns.map(col => row[col] || null);
        const placeholders = columns.map(() => '?').join(', ');
        const sql = `INSERT INTO ${table} (${columns.join(',')}) VALUES (${placeholders})`;

        connection.query(sql, values, (err) => {
          if (err) {
            console.error(`❌ Row ${count} failed in ${table}:`, err.message);
          }

          if (count % 1000 === 0) {
            console.log(`🔄 Inserted ${count} rows into ${table}...`);
          }
        });
      })
      .on('end', () => {
        console.log(`✅ Finished importing ${name} into ${table} (${count} rows)\n`);
        resolve();
      })
      .on('error', (err) => {
        console.error(`❌ Error reading ${name}:`, err);
        reject(err);
      });
  });
};

// Run import for all files
(async () => {
  connection.connect();

  for (const file of files) {
    await importCSV(file);
  }

  connection.end();
})();
