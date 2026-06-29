# ============================================================
#  email_service.py — Gmail SMTP Email Sender
#  Sends a formatted email to Sathwik when someone
#  submits the contact form
# ============================================================

import smtplib
import os
from email.mime.multipart import MIMEMultipart
from email.mime.text      import MIMEText
from datetime             import datetime
from dotenv               import load_dotenv

load_dotenv()

GMAIL_USER     = os.getenv("GMAIL_USER")      # your Gmail address
GMAIL_PASSWORD = os.getenv("GMAIL_PASSWORD")  # Gmail App Password
RECEIVER_EMAIL = os.getenv("RECEIVER_EMAIL", GMAIL_USER)  # where to receive


# ══════════════════════════════════════════════════════════
#  BUILD HTML EMAIL TEMPLATE
# ══════════════════════════════════════════════════════════
def build_html(sender_name, sender_email, subject, message):
    now = datetime.now().strftime("%B %d, %Y at %I:%M %p")
    return f"""
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body        {{ font-family: 'Segoe UI', Arial, sans-serif; background: #0F172A; margin: 0; padding: 20px; }}
    .wrapper    {{ max-width: 600px; margin: 0 auto; }}
    .card       {{ background: #111827; border-radius: 16px; border: 1px solid rgba(56,189,248,0.15); overflow: hidden; }}
    .header     {{ background: linear-gradient(135deg, #0F172A, #1E3A5F); padding: 32px; border-bottom: 1px solid rgba(56,189,248,0.15); }}
    .header h1  {{ color: #38BDF8; font-size: 20px; margin: 0 0 4px; letter-spacing: 0.05em; }}
    .header p   {{ color: #64748B; font-size: 13px; margin: 0; font-family: monospace; }}
    .body       {{ padding: 32px; }}
    .field      {{ margin-bottom: 24px; }}
    .label      {{ font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase;
                   color: #38BDF8; margin-bottom: 6px; font-family: monospace; }}
    .value      {{ font-size: 15px; color: #F8FAFC; line-height: 1.6; }}
    .value a    {{ color: #38BDF8; text-decoration: none; }}
    .message-box{{ background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
                   border-radius: 8px; padding: 16px; color: #CBD5E1; font-size: 14px;
                   line-height: 1.75; white-space: pre-wrap; }}
    .footer     {{ padding: 20px 32px; border-top: 1px solid rgba(255,255,255,0.05);
                   font-size: 11px; color: #475569; font-family: monospace; }}
    .dot        {{ display: inline-block; width: 6px; height: 6px; border-radius: 50%;
                   background: #4ADE80; margin-right: 6px; vertical-align: middle; }}
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header">
        <h1>📬 New Portfolio Message</h1>
        <p>Received on {now}</p>
      </div>
      <div class="body">
        <div class="field">
          <div class="label">From</div>
          <div class="value">{sender_name}</div>
        </div>
        <div class="field">
          <div class="label">Email</div>
          <div class="value"><a href="mailto:{sender_email}">{sender_email}</a></div>
        </div>
        <div class="field">
          <div class="label">Subject</div>
          <div class="value">{subject}</div>
        </div>
        <div class="field">
          <div class="label">Message</div>
          <div class="message-box">{message}</div>
        </div>
      </div>
      <div class="footer">
        <span class="dot"></span>
        Srinivas Sathwik Maddali — Portfolio Contact System
      </div>
    </div>
  </div>
</body>
</html>
"""


# ══════════════════════════════════════════════════════════
#  SEND EMAIL
# ══════════════════════════════════════════════════════════
def send_email(sender_name, sender_email, subject, message):
    if not GMAIL_USER or not GMAIL_PASSWORD:
        print("[EMAIL] ⚠ Skipping — GMAIL_USER or GMAIL_PASSWORD not set in .env")
        return False

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"[Portfolio] {subject} — from {sender_name}"
        msg["From"]    = GMAIL_USER
        msg["To"]      = RECEIVER_EMAIL
        msg["Reply-To"]= sender_email   # clicking Reply goes to the client

        # Plain text fallback
        plain = (
            f"New message from your portfolio\n\n"
            f"Name:    {sender_name}\n"
            f"Email:   {sender_email}\n"
            f"Subject: {subject}\n\n"
            f"Message:\n{message}"
        )

        msg.attach(MIMEText(plain, "plain"))
        msg.attach(MIMEText(build_html(sender_name, sender_email, subject, message), "html"))

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(GMAIL_USER, GMAIL_PASSWORD)
            server.sendmail(GMAIL_USER, RECEIVER_EMAIL, msg.as_string())

        print(f"[EMAIL] ✓ Sent to {RECEIVER_EMAIL}")
        return True

    except smtplib.SMTPAuthenticationError:
        print("[EMAIL] ✗ Auth failed — check your Gmail App Password in .env")
        return False
    except Exception as e:
        print(f"[EMAIL] ✗ Failed → {e}")
        return False
