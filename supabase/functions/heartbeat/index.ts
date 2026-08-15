import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (_req) => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    await supabase.from("heartbeat").insert({});

    const cutoff = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
    await supabase.from("heartbeat").delete().lt("pinged_at", cutoff);

    return new Response("ok", { status: 200 });
  } catch (err) {
    console.error("heartbeat error:", err);
    return new Response("error", { status: 500 });
  }
});