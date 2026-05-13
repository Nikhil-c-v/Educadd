# EduCadd Backend - SQLite

Node.js + Express backend for the EduCadd website using SQLite database.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Copy `.env.example` to `.env`:**
   ```bash
   cp .env.example .env
   ```

3. **Update `.env` values:**
   ```
   SQLITE_STORAGE=./data/educadd.sqlite
   FRONTEND_URL=http://localhost:5500,https://yourdomain.com,https://www.yourdomain.com
   NODE_ENV=production
   PRIMARY_CONTACT_EMAIL=mk.consultants13@gmail.com
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your_gmail@gmail.com
   SMTP_PASS=your_gmail_app_password
   SMTP_FROM=your_gmail@gmail.com
   ```

4. **Run the server:**
   ```bash
   npm start
   ```

The server will run on `http://localhost:5000` by default.

For local development, the frontend uses `http://localhost:5000` automatically. For production with frontend on GoDaddy and a separate backend host, set `FRONTEND_URL` to your GoDaddy domain.

## Deployment

### Frontend on GoDaddy

1. Upload the root frontend files to GoDaddy.
2. Edit `site-config.js` and set `window.EDUCADD_API_URL` to your deployed backend URL.
3. Make sure your GoDaddy domain matches one of the URLs listed in `FRONTEND_URL` on the backend.

### Backend Hosting

1. Deploy the `backend` folder to your preferred Node.js hosting provider.
2. Set these environment variables in your hosting environment:
   - `SQLITE_STORAGE` = `./data/educadd.sqlite`
   - `FRONTEND_URL` = `https://yourdomain.com,https://www.yourdomain.com`
   - `JWT_SECRET`
   - `JWT_REFRESH_SECRET`
   - `PRIMARY_CONTACT_EMAIL`
   - `SMTP_HOST`
   - `SMTP_PORT`
   - `SMTP_SECURE`
   - `SMTP_USER`
   - `SMTP_PASS`
   - `SMTP_FROM`
3. Start command: `npm start`

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
- `SQLITE_STORAGE` - SQLite database file path (default: `./data/educadd.sqlite`)
- `FRONTEND_URL` - Allowed frontend origins, comma-separated
- `NODE_ENV` - Environment (development/production)
- `PRIMARY_CONTACT_EMAIL` - Inbox that receives new lead and registration notifications
- `SMTP_HOST` - SMTP server host
- `SMTP_PORT` - SMTP server port
- `SMTP_SECURE` - `true` for SSL, otherwise `false`
- `SMTP_USER` - SMTP login username
- `SMTP_PASS` - SMTP login password or app password
- `SMTP_FROM` - From address used for outgoing notification emails
