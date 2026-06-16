// @ts-nocheck

import { createClient } from 'npm:@supabase/supabase-js@2.103.1';

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(data: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      ...corsHeaders,
      ...(init.headers ?? {}),
    },
  });
}

const PLAN_PRICES: Record<string, number> = {
  pro_monthly: 99900, // INR in paise (999.00 INR)
  pro_annual: 999900, // INR in paise (9999.00 INR)
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, { status: 405 });

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID');
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');

    if (!supabaseUrl || !supabaseAnonKey || !razorpayKeyId || !razorpayKeySecret) {
      return json({ error: 'Missing environment variables.' }, { status: 500 });
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return json({ error: 'Unauthorized.' }, { status: 401 });

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) return json({ error: 'Unauthorized.' }, { status: 401 });

    const { plan } = (await req.json().catch(() => ({}))) as { plan?: string };
    if (!plan || !PLAN_PRICES[plan]) {
      return json({ error: 'Invalid plan selected.' }, { status: 400 });
    }

    const amount = PLAN_PRICES[plan];

    // Create Razorpay Order
    const rzpUrl = 'https://api.razorpay.com/v1/orders';
    const rzpAuth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);

    const rzpRes = await fetch(rzpUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${rzpAuth}`,
      },
      body: JSON.stringify({
        amount,
        currency: 'INR',
        receipt: `rcpt_${userData.user.id}_${Date.now()}`
      }),
    });

    if (!rzpRes.ok) {
      const errText = await rzpRes.text();
      console.error('Razorpay Error:', errText);
      return json({ error: 'Failed to create Razorpay order.' }, { status: 500 });
    }

    const orderData = await rzpRes.json();

    return json({
      razorpay_order_id: orderData.id,
      amount_inr: amount / 100,
      currency: 'INR',
      key_id: razorpayKeyId,
    });

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return json({ error: message }, { status: 500 });
  }
});
