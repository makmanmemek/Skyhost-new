import { NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request) {
 try {
  const body=await request.json();
  const expected=crypto.createHash("sha512").update(String(body.order_id)+String(body.status_code)+String(body.gross_amount)+process.env.MIDTRANS_SERVER_KEY).digest("hex");
  if(!process.env.MIDTRANS_SERVER_KEY || expected!==body.signature_key) return NextResponse.json({error:"Signature tidak valid"},{status:401});
  const admin=createAdminClient();
  let status="pending";
  if(body.transaction_status==="settlement" || body.transaction_status==="capture" && body.fraud_status==="accept") status="paid";
  else if(["deny","cancel","expire"].includes(body.transaction_status)) status="failed";
  const {error}=await admin.from("orders").update({payment_status:status,midtrans_transaction_id:body.transaction_id}).eq("id",body.order_id);
  if(error) throw error;
  return NextResponse.json({ok:true});
 } catch(e) { return NextResponse.json({error:e.message},{status:500}); }
}