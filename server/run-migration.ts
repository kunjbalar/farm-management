import { pool } from './db';

async function runMigration() {
  try {
    console.log('Running migration: Add profile_photo column...');
    
    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_photo TEXT;
    `);
    
    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
