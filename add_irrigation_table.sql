-- Add irrigation table to farm management database
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

-- Add index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_irrigation_user_id ON irrigation(user_id);

-- Add index on scheduled_time for sorting
CREATE INDEX IF NOT EXISTS idx_irrigation_scheduled_time ON irrigation(scheduled_time);
