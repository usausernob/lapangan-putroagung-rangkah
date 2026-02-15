import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `Kamu adalah asisten AI untuk Lapangan Putroagung, tempat sewa lapangan olahraga di Surabaya.

Info penting:
- Tersedia 3 lapangan: Voli (Indoor), Basket (Indoor), Mini Soccer (Outdoor/Rumput Sintetis)
- Jam operasional: 07:00 - 20:00 setiap hari
- Harga: Rp 200.000/sesi (Sewa Rp 100.000, Kebersihan Rp 50.000, Keamanan Rp 50.000)
- Maksimal 3 booking per slot waktu
- Fasilitas: Parkir motor & mobil, Air minum, WiFi, Keamanan, Musholla
- Lokasi: Putroagung, Surabaya, Jawa Timur

SOP:
1. Datang 15 menit sebelum jadwal
2. Booking tidak hangus jika terlambat
3. Jaga kebersihan lapangan
4. Dilarang bawa makanan ke area lapangan
5. Gunakan sepatu olahraga yang sesuai

Jawab dalam Bahasa Indonesia yang ramah dan ringkas.`,
          },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
