# Health Service Website

A minimal health service website (static pages) served by an Express server.

Quick start:

```bash
npm install
npm start
```

Open http://localhost:3000 in your browser.

Notes:
- Contact form posts to `/contact` and is currently logged to the server console.
- To enable email delivery, integrate an SMTP/email service in `server.js`.

Environment and email
 - Copy `.env.example` to `.env` and fill in SMTP values to enable email notifications.
 - When configured the server will send contact and appointment emails to `CONTACT_RECEIVER`.

Appointment booking
 - A booking UI is available at `/appointments.html` which posts to `/appointments`.

Deployment
 - This project can be deployed to Node-friendly hosts (Heroku, Render, Vercel Serverless).
 - Ensure env variables from `.env.example` are set in the host's environment.
