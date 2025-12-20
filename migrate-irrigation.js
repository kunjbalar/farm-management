import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const createIrrigationTable = async () => {
  const client = await pool.connect();
  try {
    console.log('Creating irrigation table...');
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS irrigation (
        id SERIAL PRIMARY KEY,
        field_name VARCHAR(255) NOT NULL,
        scheduled_time TIMESTAMP NOT NULL,
        duration VARCHAR(100) NOT NULL,
        water_usage VARCHAR(100) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'Scheduled',
        notes TEXT,
        user_id VARCHAR NOT NULL REFERENCES users(id),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    
    console.log('✓ Irrigation table created');
    
    console.log('Creating indexes...');
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_irrigation_user_id ON irrigation(user_id);
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_irrigation_scheduled_time ON irrigation(scheduled_time);
    `);
    
    console.log('✓ Indexes created');
    console.log('✓ Migration completed successfully!');
    
  } catch (error) {
    console.error('Error during migration:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

createIrrigationTable();
