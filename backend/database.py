# ============================================================
#  database.py — SQLite Database Layer
#  Tables: messages, events (visitor tracking)
# ============================================================

import sqlite3
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "portfolio.db")


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row   # lets us use dict-style access
    return conn


# ══════════════════════════════════════════════════════════
#  INIT — Create tables if they don't exist
# ══════════════════════════════════════════════════════════
def init_db():
    conn = get_connection()
    cur  = conn.cursor()

    # Contact messages table
    cur.execute("""
        CREATE TABLE IF NOT EXISTS messages (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            name       TEXT    NOT NULL,
            email      TEXT    NOT NULL,
            subject    TEXT,
            message    TEXT    NOT NULL,
            ip         TEXT,
            read       INTEGER DEFAULT 0,
            created_at TEXT    DEFAULT (datetime('now'))
        )
    """)

    # Event tracking table (resume downloads, page visits, etc.)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS events (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            event      TEXT    NOT NULL,
            count      INTEGER DEFAULT 0,
            updated_at TEXT    DEFAULT (datetime('now')),
            UNIQUE(event)
        )
    """)

    conn.commit()
    conn.close()
    print("[DB] Database initialized ✓")


# ══════════════════════════════════════════════════════════
#  MESSAGES
# ══════════════════════════════════════════════════════════
def save_message(name, email, subject, message, ip=None):
    conn = get_connection()
    conn.execute(
        "INSERT INTO messages (name, email, subject, message, ip) VALUES (?, ?, ?, ?, ?)",
        (name, email, subject, message, ip)
    )
    conn.commit()
    conn.close()
    print(f"[DB] Message saved from {name} <{email}>")


def get_all_messages():
    conn = get_connection()
    rows = conn.execute(
        "SELECT * FROM messages ORDER BY created_at DESC"
    ).fetchall()
    conn.close()
    return [dict(row) for row in rows]


def mark_as_read(message_id):
    conn = get_connection()
    conn.execute("UPDATE messages SET read = 1 WHERE id = ?", (message_id,))
    conn.commit()
    conn.close()


# ══════════════════════════════════════════════════════════
#  EVENT TRACKING
# ══════════════════════════════════════════════════════════
def track_event(event_name):
    conn = get_connection()
    conn.execute("""
        INSERT INTO events (event, count, updated_at)
        VALUES (?, 1, datetime('now'))
        ON CONFLICT(event) DO UPDATE SET
            count      = count + 1,
            updated_at = datetime('now')
    """, (event_name,))
    conn.commit()
    conn.close()


def get_stats():
    conn = get_connection()
    events   = conn.execute("SELECT event, count FROM events").fetchall()
    msg_count = conn.execute("SELECT COUNT(*) as total FROM messages").fetchone()
    unread    = conn.execute("SELECT COUNT(*) as total FROM messages WHERE read = 0").fetchone()
    conn.close()

    stats = {row["event"]: row["count"] for row in events}
    stats["total_messages"] = msg_count["total"]
    stats["unread_messages"] = unread["total"]
    return stats
