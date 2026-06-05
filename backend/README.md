# EduCadd Backend - PostgreSQL

Node.js + Express backend for the EduCadd website using PostgreSQL with Sequelize.

## Local Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy environment file:
   ```bash
   cp .env.example .env
   ```

3. Update `.env` values:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `JWT_REFRESH_SECRET`
   - `FRONTEND_URL`
   - SMTP values if notifications are enabled

4. Start server:
   ```bash
   npm start
   ```

Server runs at `http://localhost:5000` by default.

## Vercel Deployment (Serverless)

This repo includes `backend/api/index.js` as the Vercel serverless entrypoint and root `vercel.json` routes `/api/*` to it.

Required Vercel environment variables:
- `DATABASE_URL`
- `NODE_ENV=production`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `JWT_EXPIRES_IN=7d`
- `JWT_REFRESH_EXPIRES_IN=30d`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_FULL_NAME` (optional)
- `ADMIN_PASSWORD_RESET=false` (set `true` only when you want to rotate admin password)
- `FRONTEND_URL`
- `FRONTEND_URL_REGEX` (optional, for preview domains)
- `DB_SYNC=false` (recommended in production)
- `PRIMARY_CONTACT_EMAIL`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`

Example CORS values for Vercel:
- `FRONTEND_URL=https://your-project.vercel.app,https://www.yourdomain.com,https://yourdomain.com`
- `FRONTEND_URL_REGEX=^https://your-project(-[a-z0-9-]+)?\.vercel\.app$`

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/leads` - Create lead
- `GET /api/leads` - Get leads (admin)
- `GET /api/leads/:id` - Get lead by id (admin)
- `PUT /api/leads/:id` - Update lead (admin)
- `DELETE /api/leads/:id` - Delete lead (admin)
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Logout
