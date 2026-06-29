# ============================================================
#  app.py — Flask Backend for Sathwik Portfolio
#  Handles: Contact Form, Email Sending, SQLite Storage
# ============================================================

from flask import Flask, request, jsonify
from flask_cors import CORS
from database import init_db, save_message, get_all_messages
from email_service import send_email
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# ── Allow React frontend to talk to this backend ──────────
CORS(app, origins=[
    "http://localhost:5173",   # Vite dev server
    "http://localhost:3000",   # Alternative
    os.getenv("FRONTEND_URL", "")  # Production URL
])

# ── Initialize database on startup ────────────────────────
init_db()


# ══════════════════════════════════════════════════════════
#  CONTACT FORM — POST /api/contact
# ══════════════════════════════════════════════════════════
@app.route("/api/contact", methods=["POST"])
def contact():
    try:
        data = request.get_json()

        # ── Validate required fields ───────────────────────
        name    = data.get("name",    "").strip()
        email   = data.get("email",   "").strip()
        subject = data.get("subject", "").strip() or "No Subject"
        message = data.get("message", "").strip()

        if not name or not email or not message:
            return jsonify({
                "success": False,
                "error": "Name, email, and message are required."
            }), 400

        if "@" not in email or "." not in email:
            return jsonify({
                "success": False,
                "error": "Please provide a valid email address."
            }), 400

        # ── Save to SQLite database ────────────────────────
        save_message(name, email, subject, message)

        # ── Send email to you (Sathwik) ────────────────────
        email_sent = send_email(
            sender_name    = name,
            sender_email   = email,
            subject        = subject,
            message        = message,
        )

        return jsonify({
            "success": True,
            "message": "Message received! I'll get back to you within 24 hours.",
            "email_sent": email_sent
        }), 200

    except Exception as e:
        print(f"[ERROR] /api/contact → {e}")
        return jsonify({
            "success": False,
            "error": "Something went wrong. Please try again."
        }), 500


# ══════════════════════════════════════════════════════════
#  ADMIN — GET /api/admin/messages?key=YOUR_ADMIN_KEY
#  View all messages sent through the contact form
# ══════════════════════════════════════════════════════════
@app.route("/api/admin/messages", methods=["GET"])
def admin_messages():
    key = request.args.get("key", "")
    admin_key = os.getenv("ADMIN_KEY", "sathwik_admin_2025")

    if key != admin_key:
        return jsonify({"success": False, "error": "Unauthorized"}), 401

    messages = get_all_messages()
    return jsonify({"success": True, "messages": messages}), 200


# ══════════════════════════════════════════════════════════
#  HEALTH CHECK — GET /api/health
# ══════════════════════════════════════════════════════════
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "online",
        "time":   datetime.utcnow().isoformat(),
        "server": "Sathwik Portfolio API"
    }), 200


# ══════════════════════════════════════════════════════════
#  STATS — GET /api/stats  (visitor/download counters)
# ══════════════════════════════════════════════════════════
@app.route("/api/stats", methods=["GET"])
def stats():
    from database import get_stats
    data = get_stats()
    return jsonify({"success": True, "stats": data}), 200


@app.route("/api/stats/track", methods=["POST"])
def track():
    try:
        data  = request.get_json()
        event = data.get("event", "")   # "resume_download" | "page_visit"
        from database import track_event
        track_event(event)
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({"success": False}), 500


# ══════════════════════════════════════════════════════════
if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    print(f"\n🚀 Sathwik Portfolio API running at http://localhost:{port}")
    print(f"   Health check → http://localhost:{port}/api/health\n")
    app.run(debug=True, port=port)
