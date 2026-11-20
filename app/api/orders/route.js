import {NextResponse} from "next/server";
import {createClient} from "@/lib/supabase/server";
import {createAdminClient} from "@/lib/supabase/admin";
const plans={Starter:15000,Business:35000,Pro:75000};
export async function POST(request){
 try{
  const supabase=createClient();const {data:{user}}=await supabase.auth.getUser();
  if(!user)return NextResponse.json({error:"Silakan masuk atau daftar terlebih dahulu."},{status:401});
  const body=await request.json();if(!plans[body.plan]||typeof body.name!=="string"||body.name.trim().length<2||body.name.length>100)return NextResponse.json({error:"Data pesanan tidak valid."},{status:400});
  if(String(body.email||"").toLowerCase()!==String(user.email||"").toLowerCase())return NextResponse.json({error:"Email harus sama dengan email akun."},{status:400});
  const admin=createAdminClient();const {data:order,error}=await admin.from("orders").insert({user_id:user.id,customer_name:body.name.trim(),customer_email:user.email,plan:body.plan,amount:plans[body.plan]}).select().single();if(error)throw error;
  if(!process.env.MIDTRANS_SERVER_KEY)return NextResponse.json({order_id:order.id,message:"Pesanan tersimpan. Pembayaran belum dikonfigurasi."});
  const base=process.env.MIDTRANS_IS_PRODUCTION==="true"?"https://app.midtrans.com":"https://app.sandbox.midtrans.com";
  const auth=Buffer.from(process.env.MIDTRANS_SERVER_KEY+":").toString("base64");
  const res=await fetch(base+"/snap/v1/transactions",{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json","Authorization":"Basic "+auth},body:JSON.stringify({transaction_details:{order_id:order.id,gross_amount:plans[body.plan]},customer_details:{first_name:body.name,email:user.email},item_details:[{id:body.plan,price:plans[body.plan],quantity:1,name:"SkyHost "+body.plan}]})});
  const payment=await res.json();if(!res.ok)throw new Error(payment.error_messages?.join(", ")||"Gagal membuat pembayaran");
  await admin.from("orders").update({payment_token:payment.token,payment_url:payment.redirect_url}).eq("id",order.id);
  return NextResponse.json({order_id:order.id,payment_url:payment.redirect_url});
 }catch(e){return NextResponse.json({error:e.message||"Server error"},{status:500});}
}