import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const plans = { Starter: 15000, Business: 35000, Pro: 75000 };

export async function POST(request) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Silakan masuk atau daftar terlebih dahulu." }, { status: 401 });
    }

    const body = await request.json();
    if (
      !plans[body.plan] ||
      typeof body.name !== "string" ||
      body.name.trim().length < 2 ||
      body.name.trim().length > 100
    ) {
      return NextResponse.json({ error: "Data pesanan tidak valid." }, { status: 400 });
    }
    if (String(body.email || "").toLowerCase() !== String(user.email || "").toLowerCase()) {
      return NextResponse.json({ error: "Email harus sama dengan email akun." }, { status: 400 });
    }

    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        customer_name: body.name.trim(),
        customer_email: user.email,
        plan: body.plan,
        amount: plans[body.plan],
      })
      .select("id, plan, amount, payment_status")
      .single();

    if (error) throw error;

    return NextResponse.json({
      order_id: order.id,
      message: "Pesanan berhasil dibuat dan menunggu pembayaran. Integrasi pembayaran sedang disiapkan.",
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}
