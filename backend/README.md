# EduCadd Backend - PostgreSQL

Node.js + Express backend for the EduCadd website using PostgreSQL database.

## Setup

1. **Install PostgreSQL** from https://www.postgresql.org/download/

2. **Create a database** in PostgreSQL:
   ```bash
   createdb educadd
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Copy `.env.example` to `.env`:**
   ```bash
   cp .env.example .env
   ```

5. **Update `.env` with your PostgreSQL credentials:**
   ```
   DB_NAME=educadd
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_PORT=5432
   ```

6. **Run the server:**
   ```bash
   npm start
   ```

The server will run on `http://localhost:5000` by default.

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/leads` - Create new lead
- `GET /api/leads` - Get all leads
- `GET /api/leads/:id` - Get lead by id
- `PUT /api/leads/:id` - Update lead
- `DELETE /api/leads/:id` - Delete lead
- `GET /api/leads/filter/status/:status` - Filter leads by status
- `GET /api/leads/filter/course/:course` - Filter leads by course

## Database Schema

The Lead table includes:
- `id` - UUID primary key
- `fullName` - String (required)
- `phoneNumber` - String (required, 10 digits)
- `email` - String (optional)
- `selectedCourse` - Enum (required)
- `status` - Enum (default: 'New')
- `notes` - String (optional)
- `createdAt` - Timestamp
- `updatedAt` - Timestamp

## Environment Variables

- `PORT` - Server port (default: 5000)
- `DB_NAME` - Database name
- `DB_USER` - PostgreSQL username
- `DB_PASSWORD` - PostgreSQL password
- `DB_HOST` - Database host
- `DB_PORT` - Database port (default: 5432)
- `NODE_ENV` - Environment (development/production)
