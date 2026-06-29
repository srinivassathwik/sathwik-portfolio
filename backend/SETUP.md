# ============================================================
#  BACKEND SETUP GUIDE
#  Read this fully before running the backend
# ============================================================

## STEP 1 — Install Python packages

Open PowerShell inside the `backend/` folder:

    cd C:\Users\HP\Downloads\portfolio\portfolio\backend
    pip install flask flask-cors python-dotenv

---

## STEP 2 — Set up your Gmail App Password

This is NOT your normal Gmail password. Follow exactly:

1. Go to https://myaccount.google.com
2. Click "Security" in the left menu
3. Scroll to "2-Step Verification" → Turn it ON (if not already)
4. Go back to Security → scroll to "App passwords"
5. Select App: "Mail" → Device: "Windows Computer"
6. Click Generate → copy the 16-character password shown

---

## STEP 3 — Create your .env file

Copy .env.example → rename it to .env

Edit .env with your real details:

    GMAIL_USER=yourgmail@gmail.com
    GMAIL_PASSWORD=abcdefghijklmnop    ← the 16-char App Password (no spaces)
    RECEIVER_EMAIL=srinivassathwikmaddali@gmail.com
    ADMIN_KEY=sathwik_admin_2025

---

## STEP 4 — Run the backend

    python app.py

You should see:
    🚀 Sathwik Portfolio API running at http://localhost:5000

---

## STEP 5 — Run the frontend (separate terminal)

    cd ..
    npm run dev

---

## STEP 6 — Test it works

Open browser → http://localhost:5173
Fill the contact form → Submit
Check:
  ✓ You see "Message Sent!" on screen
  ✓ You get an email in your Gmail
  ✓ Message appears in Admin panel

---

## STEP 7 — View Admin Panel

Open backend/admin.html in your browser
(just double-click the file)
Enter your ADMIN_KEY when prompted

---

## API Endpoints Reference

| Endpoint                          | Method | Description              |
|-----------------------------------|--------|--------------------------|
| /api/health                       | GET    | Check server is running  |
| /api/contact                      | POST   | Submit contact form      |
| /api/admin/messages?key=YOUR_KEY  | GET    | View all messages        |
| /api/stats                        | GET    | View visitor stats       |
| /api/stats/track                  | POST   | Track an event           |

---

## Troubleshooting

❌ "npm is not recognized" → restart PowerShell after installing Node.js
❌ "pip is not recognized" → run: python -m pip install flask flask-cors python-dotenv
❌ Email not sending → double-check App Password, no spaces, 2FA must be ON
❌ CORS error in browser → make sure Flask is running on port 5000
❌ "Module not found" → run pip install from inside the backend/ folder
