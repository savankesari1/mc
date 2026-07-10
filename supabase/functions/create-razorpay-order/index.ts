import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Razorpay from "https://esm.sh/razorpay@2.9.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { resourceId } = await req.json();

    // 1. Initialize Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "" // Use service role to bypass RLS for this specific read
    );

    // 2. Fetch the true price from the database securely
    const { data: resource, error } = await supabase
      .from("resources")
      .select("price")
      .eq("id", resourceId)
      .single();

    if (error || !resource) throw new Error("Resource not found");

    // 3. Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: Deno.env.get("RAZORPAY_KEY_ID"),
      key_secret: Deno.env.get("RAZORPAY_KEY_SECRET"),
    });

    // 4. Create the order in Razorpay
    const order = await razorpay.orders.create({
      amount: resource.price, // Amount is securely pulled from DB
      currency: "INR",
      receipt: `receipt_order_${resourceId}`,
    });

    // 5. Return the secure order_id to the frontend
    return new Response(JSON.stringify({ orderId: order.id, amount: resource.price }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { 
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400 
    });
  }
});

