import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const body = await req.json();
    console.log("DOKU notification received:", JSON.stringify(body));

    // DOKU sends notification with order and transaction info
    const invoiceNumber = body?.order?.invoice_number;
    const transactionStatus = body?.transaction?.status;

    if (!invoiceNumber) {
      throw new Error("Missing invoice number in notification");
    }

    let paymentStatus = "pending";
    if (transactionStatus === "SUCCESS") {
      paymentStatus = "paid";
    } else if (transactionStatus === "FAILED") {
      paymentStatus = "failed";
    } else if (transactionStatus === "EXPIRED") {
      paymentStatus = "expired";
    }

    const { error } = await supabase
      .from("bookings")
      .update({ payment_status: paymentStatus })
      .eq("id", invoiceNumber);

    if (error) {
      console.error("Error updating booking:", error);
      throw new Error(`Failed to update booking: ${error.message}`);
    }

    console.log(`Booking ${invoiceNumber} updated to ${paymentStatus}`);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("DOKU notification error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
