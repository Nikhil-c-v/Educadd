/**
 * Google Sheets integration — appends a new lead row to a configured sheet.
 *
 * Required env vars (all optional — if absent, sync is silently skipped):
 *   GOOGLE_SHEET_ID          — the spreadsheet ID from the sheet URL
 *   GOOGLE_SERVICE_ACCOUNT_EMAIL — service account client_email
 *   GOOGLE_PRIVATE_KEY       — service account private_key (newlines as \n)
 *
 * Setup steps:
 *   1. Create a Google Cloud project & enable the Sheets API.
 *   2. Create a Service Account, download the JSON key.
 *   3. Copy client_email → GOOGLE_SERVICE_ACCOUNT_EMAIL
 *      Copy private_key  → GOOGLE_PRIVATE_KEY  (keep \n escape sequences)
 *   4. Open your Google Sheet, click Share, add the service account email as Editor.
 *   5. Copy the Sheet ID from the URL:
 *      https://docs.google.com/spreadsheets/d/<SHEET_ID>/edit
 *      → GOOGLE_SHEET_ID
 */

const { google } = require('googleapis');

const SHEET_HEADER = ['Timestamp', 'Full Name', 'Phone', 'Email', 'Course', 'Status'];

function isConfigured() {
  return !!(
    process.env.GOOGLE_SHEET_ID &&
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_PRIVATE_KEY
  );
}

function getAuthClient() {
  return new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

/**
 * Ensures the first row of the sheet contains the header columns.
 * Only writes headers if row 1 is completely empty.
 */
async function ensureHeader(sheets, spreadsheetId) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'Sheet1!A1:F1',
  });
  const existing = res.data.values;
  if (!existing || !existing[0] || existing[0].length === 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'Sheet1!A1',
      valueInputOption: 'RAW',
      requestBody: { values: [SHEET_HEADER] },
    });
  }
}

/**
 * Appends a lead row to the Google Sheet.
 * Silently skips if env vars are not configured.
 *
 * @param {object} lead - { fullName, phoneNumber, email, selectedCourse, status, createdAt }
 */
async function appendLeadToSheet(lead) {
  if (!isConfigured()) {
    console.log('Google Sheets sync skipped: GOOGLE_SHEET_ID / credentials not configured.');
    return;
  }

  try {
    const auth = getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    await ensureHeader(sheets, spreadsheetId);

    const row = [
      lead.createdAt ? new Date(lead.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      lead.fullName || '',
      lead.phoneNumber || '',
      lead.email || '',
      lead.selectedCourse || '',
      lead.status || 'New',
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:F',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [row] },
    });

    console.log(`Google Sheets: appended lead for ${lead.fullName}`);
  } catch (err) {
    // Log but never throw — sheet sync failure must not affect the main response
    console.error(`Google Sheets sync failed: ${err.message}`);
  }
}

module.exports = { appendLeadToSheet };
