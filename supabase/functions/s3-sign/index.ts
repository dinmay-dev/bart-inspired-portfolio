// Edge Function: s3-sign
// Returns short-lived signed URLs for AWS S3 reads/writes via the Lovable connector gateway.
// Deploy: `supabase functions deploy s3-sign --no-verify-jwt`
// Required secrets in your Supabase project: LOVABLE_API_KEY, AWS_S3_API_KEY

import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const API_URL = "https://connector-gateway.lovable.dev";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const AWS_S3_API_KEY = Deno.env.get("AWS_S3_API_KEY");
    if (!LOVABLE_API_KEY || !AWS_S3_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Missing LOVABLE_API_KEY or AWS_S3_API_KEY in function secrets." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const body = await req.json().catch(() => ({}));
    const mode = body.mode === "write" ? "write" : "read";
    const object_path = String(body.object_path || "").replace(/^\/+/, "");
    if (!object_path || object_path.length > 1024) {
      return new Response(JSON.stringify({ error: "Invalid object_path" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (object_path.includes("..")) {
      return new Response(JSON.stringify({ error: "Invalid path" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const signRes = await fetch(`${API_URL}/api/v1/sign_storage_url?provider=aws_s3&mode=${mode}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": AWS_S3_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ object_path }),
    });

    const text = await signRes.text();
    if (!signRes.ok) {
      return new Response(
        JSON.stringify({ error: `Gateway sign failed [${signRes.status}]: ${text}` }),
        { status: signRes.status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(text, {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String((err as Error).message ?? err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
