-- Add soil_health table
CREATE TABLE IF NOT EXISTS soil_health (
  id SERIAL PRIMARY KEY,
  moisture VARCHAR(10) NOT NULL,
  ph_level VARCHAR(10) NOT NULL,
  nitrogen VARCHAR(10) NOT NULL,
  phosphorus VARCHAR(10) NOT NULL,
  potassium VARCHAR(10) NOT NULL,
  notes TEXT,
  user_id VARCHAR NOT NULL REFERENCES users(id),
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Add index for faster queries by user_id
CREATE INDEX IF NOT EXISTS idx_soil_health_user_id ON soil_health(user_id);
