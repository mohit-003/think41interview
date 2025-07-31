const mysql = require('mysql2/promise');

(async () => {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'thk41',
  });

  try {
    console.log('🔌 Connected to database');

    // Step 1: Create departments table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS departments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL
      );
    `);
    console.log('✅ Created departments table');

    // Step 2: Get unique department names
    const [departments] = await connection.execute(`
      SELECT DISTINCT department FROM products WHERE department IS NOT NULL
    `);

    // Step 3: Insert into departments table
    for (const row of departments) {
      await connection.execute(
        'INSERT IGNORE INTO departments (name) VALUES (?)',
        [row.department]
      );
    }
    console.log('✅ Inserted unique departments');

    // Step 4: Add department_id column to products
    const [columns] = await connection.execute(`
  SHOW COLUMNS FROM products LIKE 'department_id';
`);

if (columns.length === 0) {
  await connection.execute(`
    ALTER TABLE products ADD COLUMN department_id INT;
  `);
  console.log('✅ Added department_id column to products');
} else {
  console.log('ℹ️ department_id column already exists in products');
}




    // Step 5: Update products table with department_id
    for (const row of departments) {
      const [[dept]] = await connection.execute(
        'SELECT id FROM departments WHERE name = ?',
        [row.department]
      );

      await connection.execute(
        'UPDATE products SET department_id = ? WHERE department = ?',
        [dept.id, row.department]
      );
    }
    console.log('✅ Linked products to department_id');

    // Step 6: Add foreign key constraint
    try {
  await connection.execute(`
    ALTER TABLE products
    ADD CONSTRAINT fk_department
    FOREIGN KEY (department_id)
    REFERENCES departments(id)
    ON DELETE SET NULL
  `);
  console.log('✅ Added foreign key constraint');
} catch (error) {
  if (error.code === 'ER_DUP_KEY' || error.message.includes('Duplicate foreign key constraint name')) {
    console.log('ℹ️ Foreign key constraint fk_department already exists');
  } else {
    throw error; // Re-throw other errors
  }
}





    // Optional Step 7: Drop old column
    await connection.execute(`ALTER TABLE products DROP COLUMN department`);
    console.log('🗑️ Dropped old department column');

    console.log('🎉 Migration completed successfully');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  } finally {
    await connection.end();
  }
})();
