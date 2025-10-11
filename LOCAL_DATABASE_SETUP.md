# Local PostgreSQL Database Setup Guide

## Overview
This guide explains how to configure your Farm Management application to use a local PostgreSQL database when running on your PC for offline operation.

## Current Status (Replit Environment)
✅ Application is working with Replit's managed PostgreSQL database
✅ Order submission is fixed and working correctly
✅ All data is saved to PostgreSQL (orders and inventory tables)
✅ Inventory API endpoint returns data correctly

## Bug Fix Summary
**Problem:** Order submission was failing with "Failed to place order. Please try again." error.

**Root Cause:** The frontend was not sending the authentication token (sessionId) in the API request headers.

**Solution:** Modified `client/src/lib/queryClient.ts` to include the Authorization header with the sessionId from localStorage for all authenticated requests.

**Verification:** 
- ✅ Order submission now works
- ✅ Data saves to both `orders` and `inventory` tables
- ✅ Inventory API returns data correctly

## Local PostgreSQL Setup for Your PC

### Prerequisites
1. **Install PostgreSQL** on your local machine:
   - **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
   - **Mac**: Use Homebrew: `brew install postgresql`
   - **Linux**: `sudo apt-get install postgresql postgresql-contrib`

2. **Start PostgreSQL service**:
   - **Windows**: PostgreSQL should start automatically
   - **Mac**: `brew services start postgresql`
   - **Linux**: `sudo systemctl start postgresql`

### Database Configuration Steps

#### 1. Create Local Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Create a new database
CREATE DATABASE farm_management;

# Create a user (optional)
CREATE USER farmuser WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE farm_management TO farmuser;

# Exit psql
\q
```

#### 2. Update Environment Variables
Create a `.env` file in your project root:

```env
# Local PostgreSQL connection
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/farm_management

# Alternative with custom user
# DATABASE_URL=postgresql://farmuser:your_password@localhost:5432/farm_management
```

**Important:** Replace `your_password` with your actual PostgreSQL password.

#### 3. Update Database Schema
Run the following command to create all tables in your local database:

```bash
npm run db:push
```

This will create the following tables:
- `users` - User accounts and farm profiles
- `orders` - Order tracking
- `inventory` - Inventory items

#### 4. Verify Local Setup
Test the connection:

```bash
psql -U postgres -d farm_management -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';"
```

You should see:
```
 table_name
------------
 users
 orders
 inventory
```

### Running the Application Locally

#### 1. Install Dependencies
```bash
npm install
```

#### 2. Set Up Environment
Make sure your `.env` file has the correct DATABASE_URL pointing to localhost.

#### 3. Push Database Schema
```bash
npm run db:push
```

#### 4. Start the Application
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

### Database Connection Details

**Connection String Format:**
```
postgresql://[username]:[password]@[host]:[port]/[database]
```

**Example for localhost:**
```
postgresql://postgres:mypassword@localhost:5432/farm_management
```

**Components:**
- `username`: Your PostgreSQL username (default: `postgres`)
- `password`: Your PostgreSQL password
- `host`: `localhost` for local database
- `port`: `5432` (default PostgreSQL port)
- `database`: `farm_management` (or your chosen database name)

### Troubleshooting

#### Issue: "CONNECTION REFUSED"
**Solution:** Ensure PostgreSQL is running:
- **Mac**: `brew services list`
- **Linux**: `sudo systemctl status postgresql`
- **Windows**: Check Services app for "PostgreSQL" service

#### Issue: "AUTHENTICATION FAILED"
**Solution:** Verify your password and username are correct in the DATABASE_URL.

#### Issue: "DATABASE DOES NOT EXIST"
**Solution:** Create the database first:
```bash
psql -U postgres -c "CREATE DATABASE farm_management;"
```

#### Issue: "TABLES NOT FOUND"
**Solution:** Run the schema push:
```bash
npm run db:push
```

### Data Migration from Replit to Local

If you want to export data from Replit and import to your local database:

#### 1. Export from Replit (in Replit console)
```bash
# Export users
psql $DATABASE_URL -c "COPY users TO STDOUT WITH CSV HEADER" > users.csv

# Export orders  
psql $DATABASE_URL -c "COPY orders TO STDOUT WITH CSV HEADER" > orders.csv

# Export inventory
psql $DATABASE_URL -c "COPY inventory TO STDOUT WITH CSV HEADER" > inventory.csv
```

#### 2. Import to Local PostgreSQL
```bash
# Import users
psql -U postgres -d farm_management -c "COPY users FROM '/path/to/users.csv' WITH CSV HEADER"

# Import orders
psql -U postgres -d farm_management -c "COPY orders FROM '/path/to/orders.csv' WITH CSV HEADER"

# Import inventory
psql -U postgres -d farm_management -c "COPY inventory FROM '/path/to/inventory.csv' WITH CSV HEADER"
```

### Security Best Practices for Production

1. **Never commit `.env` file** - Add it to `.gitignore`
2. **Use strong passwords** - Don't use default passwords
3. **Limit database access** - Only allow connections from localhost when running locally
4. **Hash passwords** - The current implementation stores plain text passwords (development only)

### Testing Your Local Setup

Once configured, test the application:

1. **Register a new account**
2. **Log in**
3. **Submit an order** using the "Place Order" button
4. **Verify** the order appears in the inventory

All data will be stored in your local PostgreSQL database at `localhost:5432`.

## Files Modified (Bug Fix)

### `client/src/lib/queryClient.ts`
- Added Authorization header with sessionId to `apiRequest` function
- Added Authorization header with sessionId to `getQueryFn` function
- Both functions now retrieve sessionId from localStorage and include it in requests

### `server/routes.ts`
- Added comprehensive debug logging to POST /api/orders endpoint
- Logs session validation, request body, and database operations
- Helps trace issues during development

## Current Test Results

✅ **Order Submission Test:**
- Created test user: test@farm.com
- Submitted order: NPK Fertilizer - 500 kg
- Order ID: ORD-1760177023063-4761
- Successfully saved to `orders` table
- Successfully saved to `inventory` table

✅ **Inventory API Test:**
- GET /api/inventory returns correct data
- Data structure: `[{id, name, quantity, status, userId}]`

✅ **Database Verification:**
- Confirmed data in PostgreSQL `orders` table
- Confirmed data in PostgreSQL `inventory` table

## Support

If you encounter any issues:
1. Check the browser console for frontend errors
2. Check the terminal/server logs for backend errors
3. Verify your DATABASE_URL is correct
4. Ensure PostgreSQL is running on your machine
