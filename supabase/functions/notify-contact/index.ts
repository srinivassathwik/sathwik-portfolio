// ============================================================
//  notify-contact — Supabase Edge Function
//  Sends YOU an email via Resend whenever a visitor submits
//  the contact form. Runs on Supabase's free tier (500K
//  invocations/month) — no server to host, no cost.
//
//  Deploy:
//    supabase functions deploy notify-contact
//
//  Set secrets (never commit these):
//    supabase secrets set RESEND_API_KEY=re_xxxxxxxx
//    supabase secrets set NOTIFY_TO_EMAIL=srinivassathwikmaddali@gmail.com
// ============================================================

Deno.serve(async (req) => {
  // CORS preflight (harmless to keep even though this is only
  // ever called server-to-server by the pg_net trigger)
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, content-type",
      },
    });
  }

  try {
    const { name, email, subject, message } = await req.json();

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const NOTIFY_TO_EMAIL = Deno.env.get("NOTIFY_TO_EMAIL");

    if (!RESEND_API_KEY || !NOTIFY_TO_EMAIL) {
      console.error("Missing RESEND_API_KEY or NOTIFY_TO_EMAIL secret");
      return new Response(
        JSON.stringify({ error: "Server not configured" }),
        { status: 500 },
      );
    }

    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
        <h2 style="color:#0f172a;">New portfolio message</h2>
        <p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject || "No subject")}</p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0;" />
        <p style="white-space:pre-wrap;line-height:1.6;color:#1e293b;">${escapeHtml(message)}</p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0;" />
        <p style="font-size:12px;color:#64748b;">Reply directly to this email to respond to ${escapeHtml(name)}.</p>
      </div>
    `;

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // "onboarding@resend.dev" works immediately with zero setup.
        // Once you verify your own domain in Resend, switch this to
        // something like "contact@yourdomain.com".
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: [NOTIFY_TO_EMAIL],
        reply_to: email,
        subject: `Portfolio: ${subject || "New message"} — from ${name}`,
        html: emailHtml,
      }),
    });

    if (!resendRes.ok) {
      const errText = await resendRes.text();
      console.error("Resend error:", errText);
      return new Response(JSON.stringify({ error: "Email send failed" }), {
        status: 502,
      });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("notify-contact error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
    });
  }
});

function escapeHtml(str: string = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
