const nodemailer = require('nodemailer');

const PRIMARY_CONTACT_EMAIL = process.env.PRIMARY_CONTACT_EMAIL || 'mk.consultants13@gmail.com';

let transporter;

const getTransporter = () => {
  if (transporter) {
    return transporter;
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    return null;
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true' || Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  return transporter;
};

const sendNotificationEmail = async ({ subject, text, html, replyTo }) => {
  const activeTransporter = getTransporter();
  if (!activeTransporter) {
    console.warn('Email notification skipped: SMTP configuration is incomplete.');
    return false;
  }

  await activeTransporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: PRIMARY_CONTACT_EMAIL,
    replyTo,
    subject,
    text,
    html,
  });

  return true;
};

const formatField = (label, value) => `${label}: ${value || 'Not provided'}`;

const sendLeadNotification = async ({ fullName, phoneNumber, email, selectedCourse }) => {
  const subject = `New lead enquiry from ${fullName}`;
  const text = [
    'A new lead has been submitted from the website.',
    '',
    formatField('Full name', fullName),
    formatField('Phone number', phoneNumber),
    formatField('Email', email),
    formatField('Selected course', selectedCourse),
  ].join('\n');

  const html = `
    <h2>New lead enquiry</h2>
    <p>A new lead has been submitted from the website.</p>
    <ul>
      <li><strong>Full name:</strong> ${fullName}</li>
      <li><strong>Phone number:</strong> ${phoneNumber}</li>
      <li><strong>Email:</strong> ${email || 'Not provided'}</li>
      <li><strong>Selected course:</strong> ${selectedCourse}</li>
    </ul>
  `;

  return sendNotificationEmail({
    subject,
    text,
    html,
    replyTo: email || undefined,
  });
};

const sendRegistrationNotification = async ({ fullName, phoneNumber, email }) => {
  const subject = `New student registration from ${fullName}`;
  const text = [
    'A new user account has been created.',
    '',
    formatField('Full name', fullName),
    formatField('Phone number', phoneNumber),
    formatField('Email', email),
  ].join('\n');

  const html = `
    <h2>New user registration</h2>
    <p>A new user account has been created.</p>
    <ul>
      <li><strong>Full name:</strong> ${fullName}</li>
      <li><strong>Phone number:</strong> ${phoneNumber || 'Not provided'}</li>
      <li><strong>Email:</strong> ${email}</li>
    </ul>
  `;

  return sendNotificationEmail({
    subject,
    text,
    html,
    replyTo: email,
  });
};

module.exports = {
  PRIMARY_CONTACT_EMAIL,
  sendLeadNotification,
  sendRegistrationNotification,
};