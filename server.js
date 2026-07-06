require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Ensure data directory exists for simple persistence
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

// Configure optional SMTP transporter if env vars are provided
let transporter = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

function saveSubmission(filename, obj) {
  const file = path.join(dataDir, filename);
  const line = JSON.stringify({ ...obj, receivedAt: new Date().toISOString() }) + '\n';
  fs.appendFile(file, line, (err) => {
    if (err) console.error('Failed to save submission', err);
  });
}

async function trySendMail(opts) {
  if (!transporter) return null;
  try {
    const info = await transporter.sendMail(opts);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (err) {
    console.error('Email error:', err);
    return null;
  }
}

app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;
  console.log('Contact form submission:', { name, email, message });
  saveSubmission('contacts.log', { name, email, message });

  if (transporter) {
    const to = process.env.CONTACT_RECEIVER || process.env.SMTP_USER;
    await trySendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject: `Contact form: ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`
    });
  }

  res.json({ success: true, message: 'Message received. Thank you!' });
});

app.post('/appointments', async (req, res) => {
  const { name, email, preferredDate, service, message } = req.body;
  console.log('Appointment request:', { name, email, preferredDate, service, message });
  saveSubmission('appointments.log', { name, email, preferredDate, service, message });

  if (transporter) {
    const to = process.env.CONTACT_RECEIVER || process.env.SMTP_USER;
    await trySendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject: `Appointment request: ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nPreferred: ${preferredDate}\nService: ${service}\n\n${message}`
    });
  }

  res.json({ success: true, message: 'Appointment request received.' });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
